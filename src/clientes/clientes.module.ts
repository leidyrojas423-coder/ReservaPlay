import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClienteEntity } from './entities/cliente.entity';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClienteEntity,
    ]),
  ],

  controllers: [
    ClientesController,
  ],

  providers: [
    ClientesService,
  ],

  exports: [
    ClientesService,
    TypeOrmModule,
  ],
})
export class ClientesModule {}