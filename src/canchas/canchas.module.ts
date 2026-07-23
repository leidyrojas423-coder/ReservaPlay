import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { HorarioEntity } from '../horarios/entities/horario.entity';
import { ReservaEntity } from '../reservas/entities/reserva.entity';
import { CanchasController } from './canchas.controller';
import { CanchasService } from './canchas.service';
import { CanchaEntity } from './entities/cancha.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CanchaEntity,
      AdministradorEntity,
      HorarioEntity,
      ReservaEntity,
    ]),
  ],
  controllers: [CanchasController],
  providers: [CanchasService],
})
export class CanchasModule {}
