import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { HorarioEntity } from './entities/horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(HorarioEntity)
    private readonly horariosRepository: Repository<HorarioEntity>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<HorarioEntity> {
    const horario = this.horariosRepository.create({
      ...createHorarioDto,
      activo: createHorarioDto.activo ?? true,
    });

    try {
      return await this.horariosRepository.save(horario);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el horario');
    }
  }

  async findAll(): Promise<HorarioEntity[]> {
    return this.horariosRepository.find();
  }

  async update(id: string, updateHorarioDto: UpdateHorarioDto): Promise<HorarioEntity> {
    const horario = await this.horariosRepository.findOne({ where: { id } });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    await this.horariosRepository.update(id, updateHorarioDto);

    const updated = await this.horariosRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Horario no encontrado después de actualizar');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.horariosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Horario no encontrado');
    }
  }
}
