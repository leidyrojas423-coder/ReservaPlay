import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { User, UserRole } from '../src/users/user.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository(User);

    const email = 'admin@reservaplay.local';
    const password = 'Admin1234!';
    const name = 'Administrador ReservaPlay';

    const existing = await userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'role'],
    });

    if (existing) {
      if (existing.role === UserRole.ADMIN) {
        console.log(`El usuario administrador ya existe: ${email}`);
      } else {
        existing.role = UserRole.ADMIN;
        await userRepository.save(existing);
        console.log(`Usuario existente actualizado a administrador: ${email}`);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      active: true,
    });

    await userRepository.save(newAdmin);
    console.log('Administrador creado correctamente:');
    console.log(`  email: ${email}`);
    console.log(`  password: ${password}`);
  } catch (error) {
    console.error('Error creando el usuario administrador:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();
