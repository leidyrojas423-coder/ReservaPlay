import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteEntity } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteEntity)
    private readonly clienteRepository: Repository<ClienteEntity>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Omit<ClienteEntity, 'password'>> {
    const { correo, password } = createClienteDto;

    const existing = await this.clienteRepository.findOne({ where: { correo } });
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const cliente = this.clienteRepository.create({
      ...createClienteDto,
      password: hashedPassword,
      estado: createClienteDto.estado ?? true,
    });

    try {
      const saved = await this.clienteRepository.save(cliente);
      const { password, ...clienteSinPassword } = saved;
      return clienteSinPassword;
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el cliente');
    }
  }

  async findAll(): Promise<Omit<ClienteEntity, 'password'>[]> {
    return this.clienteRepository.find({ select: ['id', 'nombre', 'apellido', 'correo', 'telefono', 'estado', 'fechaRegistro'] });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Omit<ClienteEntity, 'password'>> {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const updateData: Partial<UpdateClienteDto> = { ...updateClienteDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    await this.clienteRepository.update(id, updateData);

    const updated = await this.clienteRepository.findOne({
      where: { id },
      select: ['id', 'nombre', 'apellido', 'correo', 'telefono', 'estado', 'fechaRegistro'],
    });

    if (!updated) {
      throw new NotFoundException('Cliente no encontrado después de actualizar');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.clienteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Cliente no encontrado');
    }
  }
}
