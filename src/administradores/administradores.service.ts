import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdministradorEntity } from './entities/administrador.entity';

type AdministradorSinPassword = Omit<AdministradorEntity, 'password'>;
type CrearAdministradorInput = Pick<AdministradorEntity, 'nombre' | 'correo' | 'password'>;

@Injectable()
export class AdministradoresService {
  constructor(
    @InjectRepository(AdministradorEntity)
    private readonly administradorRepository: Repository<AdministradorEntity>,
  ) {}

  async create(data: CrearAdministradorInput): Promise<AdministradorSinPassword> {
    const administrador = this.administradorRepository.create({
      nombre: data.nombre,
      correo: data.correo,
      password: data.password,
    });

    const saved = await this.administradorRepository.save(administrador);
    const { password: _, ...administradorSinPassword } = saved;

    return administradorSinPassword;
  }

  async findAll(): Promise<AdministradorSinPassword[]> {
    return this.administradorRepository.find({
      select: ['id', 'nombre', 'correo', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<AdministradorSinPassword> {
    const administrador = await this.administradorRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'correo', 'createdAt', 'updatedAt'],
    });

    if (!administrador) {
      throw new NotFoundException('Administrador no encontrado');
    }

    return administrador;
  }

  async update(
    id: string,
    data: Partial<AdministradorEntity>,
  ): Promise<AdministradorSinPassword> {
    const administrador = await this.administradorRepository.preload({
      id,
      nombre: data.nombre,
      correo: data.correo,
      password: data.password,
    });

    if (!administrador) {
      throw new NotFoundException('Administrador no encontrado');
    }

    const saved = await this.administradorRepository.save(administrador);
    const { password: _, ...administradorSinPassword } = saved;

    return administradorSinPassword;
  }

  async remove(id: string): Promise<void> {
    const administrador = await this.administradorRepository.findOne({
      where: { id },
      select: ['id'],
    });

    if (!administrador) {
      throw new NotFoundException('Administrador no encontrado');
    }

    await this.administradorRepository.delete(id);
  }
}