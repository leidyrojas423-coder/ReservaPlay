import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { CanchaEntity } from './entities/cancha.entity';

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(CanchaEntity)
    private readonly canchasRepository: Repository<CanchaEntity>,
  ) {}

  async create(createCanchaDto: CreateCanchaDto): Promise<CanchaEntity> {
    const cancha = this.canchasRepository.create({
      ...createCanchaDto,
      disponible: createCanchaDto.disponible ?? true,
    });

    try {
      return await this.canchasRepository.save(cancha);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear la cancha');
    }
  }

  async findAll(): Promise<CanchaEntity[]> {
    return this.canchasRepository.find();
  }

  async update(id: string, updateCanchaDto: UpdateCanchaDto): Promise<CanchaEntity> {
    const cancha = await this.canchasRepository.findOne({ where: { id } });
    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }

    await this.canchasRepository.update(id, updateCanchaDto);

    const updated = await this.canchasRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Cancha no encontrada después de actualizar');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.canchasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cancha no encontrada');
    }
  }
}
