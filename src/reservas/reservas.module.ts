import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReservaEntity } from './entities/reserva.entity';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';

import { ClienteEntity } from '../clientes/entities/cliente.entity';
import { CanchaEntity } from '../canchas/entities/cancha.entity';
import { HorarioEntity } from '../horarios/entities/horario.entity';


@Module({

  imports: [

    TypeOrmModule.forFeature([

      ReservaEntity,

      ClienteEntity,

      CanchaEntity,

      HorarioEntity,

    ]),

  ],


  controllers: [

    ReservasController,

  ],


  providers: [

    ReservasService,

  ],


})

export class ReservasModule {}