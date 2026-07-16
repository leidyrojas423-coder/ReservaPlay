import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { AdministradorEntity } from './entities/administrador.entity';

@Injectable()
export class AdministradoresService {
  constructor(
    @InjectRepository(AdministradorEntity)
    private readonly administradorRepository: Repository<AdministradorEntity>,
  ) {}

  async create(createAdministradorDto: CreateAdministradorDto): Promise<Omit<AdministradorEntity, 'password'>> {
    const { correo, password } = createAdministradorDto;

    const existing = await this.administradorRepository.findOne({ where: { correo } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const administrador = this.administradorRepository.create({
      ...createAdministradorDto,
      password: hashedPassword,
      estado: createAdministradorDto.estado ?? true,
    });

    try {
      const saved = await this.administradorRepository.save(administrador);
      const { password: _, ...administradorSinPassword } = saved;
      return administradorSinPassword;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el administrador');
    }
  }

  async findAll(): Promise<Omit<AdministradorEntity, 'password'>[]> {
    return this.administradorRepository.find({
      select: ['id', 'nombre', 'apellido', 'correo', 'telefono', 'estado', 'fechaRegistro'],
    });
  }

  async update(id: string, updateAdministradorDto: UpdateAdministradorDto): Promise<Omit<AdministradorEntity, 'password'>> {
    const administrador = await this.administradorRepository.findOne({ where: { id } });
    if (!administrador) {
      throw new NotFoundException('Administrador no encontrado');
    }

    const updateData: Partial<UpdateAdministradorDto> = { ...updateAdministradorDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    await this.administradorRepository.update(id, updateData);

    const updated = await this.administradorRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'apellido', 'correo', 'telefono', 'estado', 'fechaRegistro'],
    });

    if (!updated) {
      throw new NotFoundException('Administrador no encontrado después de actualizar');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.administradorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Administrador no encontrado');
    }
  }
}
