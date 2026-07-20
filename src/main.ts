import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  const usersService = app.get(UsersService);
  await usersService.ensureAdminUser();

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();
