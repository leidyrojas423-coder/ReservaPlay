import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { CanchasModule } from './canchas/canchas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReservasModule } from './reservas/reservas.module';
import { HorariosModule } from './horarios/horarios.module';


@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),


    TypeOrmModule.forRoot({

      type: 'postgres',

      host: 'localhost',

      port: 5432,

      username: 'postgres',

      password: 'Samu15',

      database: 'reservaplay',

      autoLoadEntities: true,

      synchronize: true,

    }),


    PassportModule,


    JwtModule.register({

      global: true,

      secret: 'reservaplay_secret',

      signOptions: {
        expiresIn: '1d',
      },

    }),


    ClientesModule,

    CanchasModule,

    HorariosModule,

    ReservasModule,

  ],
})
export class AppModule {}