import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdministradoresModule } from './administradores/administradores.module';
import { ClientesModule } from './clientes/clientes.module';
import { CanchasModule } from './canchas/canchas.module';
import { HorariosModule } from './horarios/horarios.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: Number(configService.get<string>('DB_PORT')) || 5432,
        username: configService.get<string>('DB_USER') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'postgres',
        database: configService.get<string>('DB_NAME') || 'reservaplay',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    AdministradoresModule,
    ClientesModule,
    CanchasModule,
    HorariosModule,
    ReservasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
