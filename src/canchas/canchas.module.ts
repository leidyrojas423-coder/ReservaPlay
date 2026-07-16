import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanchasController } from './canchas.controller';
import { CanchasService } from './canchas.service';
import { CanchaEntity } from './entities/cancha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CanchaEntity])],
  controllers: [CanchasController],
  providers: [CanchasService],
})
export class CanchasModule {}
