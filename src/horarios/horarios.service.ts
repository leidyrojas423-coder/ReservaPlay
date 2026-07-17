import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CanchaEntity } from '../canchas/entities/cancha.entity';
import { ReservaEntity } from '../reservas/entities/reserva.entity';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { HorarioEntity } from './entities/horario.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(HorarioEntity)
    private readonly horariosRepository: Repository<HorarioEntity>,
    @InjectRepository(CanchaEntity)
    private readonly canchasRepository: Repository<CanchaEntity>,
    @InjectRepository(ReservaEntity)
    private readonly reservasRepository: Repository<ReservaEntity>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<HorarioEntity> {
    const fechaInicio = this.parseDate(createHorarioDto.fechaInicio, 'fechaInicio');
    const fechaFin = this.parseDate(createHorarioDto.fechaFin, 'fechaFin');

    this.validateDateRange(fechaInicio, fechaFin);
    await this.validateCancha(createHorarioDto.canchaId);
    await this.validateNoOverlap(createHorarioDto.canchaId, fechaInicio, fechaFin);

    const horario = this.horariosRepository.create({
      ...createHorarioDto,
      fechaInicio,
      fechaFin,
      activo: createHorarioDto.activo ?? true,
    });

    try {
      return await this.horariosRepository.save(horario);
    } catch (error) {
      throw new InternalServerErrorException('No se pudo crear el horario');
    }
  }

  async findAll(): Promise<HorarioEntity[]> {
    return this.horariosRepository.find({
      where: { activo: true },
      order: { fechaInicio: 'ASC' },
    });
  }

  async findByCancha(canchaId: string): Promise<HorarioEntity[]> {
    return this.horariosRepository.find({
      where: { canchaId, activo: true },
      order: { fechaInicio: 'ASC' },
    });
  }

  async update(id: string, updateHorarioDto: UpdateHorarioDto): Promise<HorarioEntity> {
    const horario = await this.horariosRepository.findOne({ where: { id } });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    const fechaInicio = updateHorarioDto.fechaInicio
      ? this.parseDate(updateHorarioDto.fechaInicio, 'fechaInicio')
      : horario.fechaInicio;
    const fechaFin = updateHorarioDto.fechaFin
      ? this.parseDate(updateHorarioDto.fechaFin, 'fechaFin')
      : horario.fechaFin;
    const canchaId = updateHorarioDto.canchaId ?? horario.canchaId;

    if (!canchaId) {
      throw new BadRequestException('El horario debe estar asociado a una cancha');
    }

    this.validateDateRange(fechaInicio, fechaFin);
    await this.validateCancha(canchaId);

    const shouldValidateOverlap = (updateHorarioDto.activo ?? horario.activo) !== false;
    if (shouldValidateOverlap) {
      await this.validateNoOverlap(canchaId, fechaInicio, fechaFin, id);
    }

    await this.horariosRepository.update(id, {
      ...updateHorarioDto,
      canchaId,
      fechaInicio,
      fechaFin,
    });

    const updated = await this.horariosRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Horario no encontrado después de actualizar');
    }

    return updated;
  }

  async deactivate(id: string): Promise<HorarioEntity> {
    const horario = await this.horariosRepository.findOne({ where: { id } });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    await this.horariosRepository.update(id, { activo: false });

    const updated = await this.horariosRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException('Horario no encontrado después de desactivar');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const horario = await this.horariosRepository.findOne({ where: { id } });
    if (!horario) {
      throw new NotFoundException('Horario no encontrado');
    }

    const reservasActivas = await this.reservasRepository.find({
      where: { horarioId: id },
    });

    const tieneReservasActivas = reservasActivas.some((reserva) => this.isActiveReservation(reserva));
    if (tieneReservasActivas) {
      throw new ConflictException('No se puede eliminar un horario con reservas activas');
    }

    const result = await this.horariosRepository.delete(id);
    if (result.affected === 0) {
      throw new InternalServerErrorException('No se pudo eliminar el horario');
    }
  }

  private parseDate(value: string | Date, fieldName: string): Date {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new BadRequestException(`El campo ${fieldName} debe ser una fecha válida`);
    }

    return parsedDate;
  }

  private validateDateRange(fechaInicio: Date, fechaFin: Date): void {
    if (fechaInicio >= fechaFin) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    const now = new Date();
    if (fechaInicio < now || fechaFin < now) {
      throw new BadRequestException('No se pueden crear horarios en fechas pasadas');
    }
  }

  private async validateCancha(canchaId: string): Promise<void> {
    const cancha = await this.canchasRepository.findOne({ where: { id: canchaId } });
    if (!cancha) {
      throw new NotFoundException('Cancha no encontrada');
    }
  }

  private async validateNoOverlap(canchaId: string, fechaInicio: Date, fechaFin: Date, excludeId?: string): Promise<void> {
    const horarios = await this.horariosRepository.find({
      where: { canchaId, activo: true },
      order: { fechaInicio: 'ASC' },
    });

    const haySolapamiento = horarios.some((horario) => {
      if (excludeId && horario.id === excludeId) {
        return false;
      }

      return horario.fechaInicio < fechaFin && fechaInicio < horario.fechaFin;
    });

    if (haySolapamiento) {
      throw new ConflictException('Ya existe un horario activo que solapa con este rango en la misma cancha');
    }
  }

  private isActiveReservation(reserva: ReservaEntity): boolean {
    const estado = (reserva.estado || '').toLowerCase();
    return !['cancelada', 'cancelado', 'rechazada', 'completada', 'finalizada', 'anulada'].includes(estado);
  }
}
