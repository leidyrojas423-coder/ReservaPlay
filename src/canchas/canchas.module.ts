import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CanchasController } from './canchas.controller';
import { CanchasService } from './canchas.service';

import { CanchaEntity } from './entities/cancha.entity';
import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { ReservaEntity } from '../reservas/entities/reserva.entity';


@Module({

  imports:[
    TypeOrmModule.forFeature([
      CanchaEntity,
      AdministradorEntity,
      ReservaEntity,
    ]),
  ],


  controllers:[
    CanchasController,
  ],


  providers:[
    CanchasService,
  ],


  exports:[
    CanchasService,
  ],

})
export class CanchasModule {}