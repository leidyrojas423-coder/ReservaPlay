import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdministradoresController } from './administradores.controller';
import { AdministradoresService } from './administradores.service';
import { AdministradorEntity } from './entities/administrador.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdministradorEntity,
    ]),
  ],

  controllers: [
    AdministradoresController,
  ],

  providers: [
    AdministradoresService,
  ],

  exports: [
    AdministradoresService,
  ],
})
export class AdministradoresModule {}