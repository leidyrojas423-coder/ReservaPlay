import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { CanchasController } from './canchas.controller';
import { CanchasService } from './canchas.service';
import { CanchaEntity } from './entities/cancha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CanchaEntity, AdministradorEntity])],
  controllers: [CanchasController],
  providers: [CanchasService],
})
export class CanchasModule {}
