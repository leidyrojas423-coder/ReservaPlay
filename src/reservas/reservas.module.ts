import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasController } from './reservas.controller';
import { ReservasService } from './reservas.service';
import { ReservaEntity } from './entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReservaEntity])],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
