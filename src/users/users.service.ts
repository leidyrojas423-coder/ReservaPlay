import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { name, email, password } = createUserDto;

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.CLIENT,
      profile: createUserDto.profile,
      active: true,
    });

    try {
      const saved = await this.usersRepository.save(user);
      const { password: _, ...userWithoutPassword } = saved as User & { password?: string };
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el usuario');
    }
  }

  async ensureAdminUser(): Promise<void> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPassword) {
      return;
    }

    const existingAdmin = await this.usersRepository.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      if (existingAdmin.role !== UserRole.ADMIN) {
        existingAdmin.role = UserRole.ADMIN;
        await this.usersRepository.save(existingAdmin);
      }
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const adminUser = this.usersRepository.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      active: true,
    });

    await this.usersRepository.save(adminUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role', 'active', 'profile'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'role', 'active', 'profile'],
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async updateProfile(id: string, updateUserDto: Partial<UpdateUserDto>): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'password', 'role', 'active', 'profile'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.profile !== undefined) {
      user.profile = updateUserDto.profile;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const updated = await this.usersRepository.save(user);
    const { password: _, ...userWithoutPassword } = updated as User & { password?: string };
    return userWithoutPassword;
  }
}
