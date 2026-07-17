import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanchaEntity } from '../canchas/entities/cancha.entity';
import { ReservaEntity } from '../reservas/entities/reserva.entity';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';
import { HorarioEntity } from './entities/horario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioEntity, CanchaEntity, ReservaEntity])],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
