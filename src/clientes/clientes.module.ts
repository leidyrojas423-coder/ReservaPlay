import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClienteEntity } from './entities/cliente.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClienteEntity,
    ]),
  ],

  exports: [
    TypeOrmModule,
  ],
})
export class ClientesModule {}