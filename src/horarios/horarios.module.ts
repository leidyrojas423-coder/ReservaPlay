import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorariosController } from './horarios.controller';
import { HorariosService } from './horarios.service';
import { HorarioEntity } from './entities/horario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioEntity])],
  controllers: [HorariosController],
  providers: [HorariosService],
})
export class HorariosModule {}
