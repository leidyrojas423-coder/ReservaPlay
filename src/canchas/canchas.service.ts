import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { CanchaEntity } from './entities/cancha.entity';

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(CanchaEntity)
    private readonly canchasRepository: Repository<CanchaEntity>,
    @InjectRepository(AdministradorEntity)
    private readonly administradoresRepository: Repository<AdministradorEntity>,
  ) {}

  async create(createCanchaDto: CreateCanchaDto): Promise<CanchaEntity> {
    await this.validateAdministrador(createCanchaDto.administradorId);
    this.validateEstado(createCanchaDto.estado);

    const cancha = this.canchasRepository.create({
      ...createCanchaDto,
      activo: createCanchaDto.activo ?? true,
      estado: createCanchaDto.estado,
    });

    try {
      return await this.canchasRepository.save(cancha);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear la cancha');
    }
  }

  async findAll(): Promise<CanchaEntity[]> {
    return this.canchasRepository.find({
      where: { activo: true },
      relations: ['administrador'],
      order: { nombre: 'ASC' },
    });
  }

  async findDisponibles(): Promise<CanchaEntity[]> {
    return this.canchasRepository.find({
      where: { activo: true, estado: 'Disponible' },
      relations: ['administrador'],
      order: { nombre: 'ASC' },
    });
  }

  async update(id: string, updateCanchaDto: UpdateCanchaDto): Promise<CanchaEntity> {
    const cancha = await this.canchasRepository.findOne({ where: { id } });
    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }

    if (updateCanchaDto.administradorId) {
      await this.validateAdministrador(updateCanchaDto.administradorId);
    }

    if (updateCanchaDto.estado) {
      this.validateEstado(updateCanchaDto.estado);
    }

    await this.canchasRepository.update(id, {
      ...updateCanchaDto,
      activo: updateCanchaDto.activo ?? cancha.activo,
      estado: updateCanchaDto.estado ?? cancha.estado,
    });

    const updated = await this.canchasRepository.findOne({ where: { id }, relations: ['administrador'] });
    if (!updated) {
      throw new NotFoundException('Cancha no encontrada después de actualizar');
    }

    return updated;
  }

  async deactivate(id: string): Promise<CanchaEntity> {
    const cancha = await this.canchasRepository.findOne({ where: { id } });
    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }

    await this.canchasRepository.update(id, { activo: false, estado: 'Mantenimiento' });

    const updated = await this.canchasRepository.findOne({ where: { id }, relations: ['administrador'] });
    if (!updated) {
      throw new NotFoundException('Cancha no encontrada después de desactivar');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.canchasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cancha no encontrada');
    }
  }

  private validateEstado(estado: string): void {
    const estadosValidos = ['Disponible', 'Ocupada', 'Mantenimiento'];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException('El estado debe ser Disponible, Ocupada o Mantenimiento');
    }
  }

  private async validateAdministrador(administradorId: string): Promise<void> {
    const administrador = await this.administradoresRepository.findOne({ where: { id: administradorId } });
    if (!administrador) {
      throw new NotFoundException('Administrador no encontrado');
    }
  }
}
