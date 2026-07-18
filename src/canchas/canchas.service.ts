import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { HorarioEntity } from '../horarios/entities/horario.entity';
import { ReservaEntity, ReservaEstado } from '../reservas/entities/reserva.entity';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { DisponibilidadCanchaDto } from './dto/disponibilidad-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { CanchaEntity } from './entities/cancha.entity';

@Injectable()
export class CanchasService {
  constructor(
    @InjectRepository(CanchaEntity)
    private readonly canchasRepository: Repository<CanchaEntity>,
    @InjectRepository(AdministradorEntity)
    private readonly administradoresRepository: Repository<AdministradorEntity>,
    @InjectRepository(HorarioEntity)
    private readonly horariosRepository: Repository<HorarioEntity>,
    @InjectRepository(ReservaEntity)
    private readonly reservasRepository: Repository<ReservaEntity>,
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

  async consultarDisponibilidad(filtros: DisponibilidadCanchaDto): Promise<any> {
    const fechaConsulta = new Date(filtros.fecha);
    if (Number.isNaN(fechaConsulta.getTime())) {
      throw new BadRequestException('La fecha es obligatoria y debe ser válida');
    }

    const canchas = await this.canchasRepository.find({
      where: { activo: true, estado: 'Disponible' },
      relations: ['administrador'],
      order: { nombre: 'ASC' },
    });

    const horarios = await this.horariosRepository.find({
      where: { activo: true },
      order: { fechaInicio: 'ASC' },
    });

    const reservas = await this.reservasRepository.find({
      where: { fecha: filtros.fecha },
      order: { fecha: 'ASC' },
    });

    const resultados = canchas
      .filter((cancha) => filtros.canchaId ? cancha.id === filtros.canchaId : true)
      .map((cancha) => {
        const horariosDisponibles = horarios
          .filter((horario) => horario.canchaId === cancha.id)
          .filter((horario) => this.horarioEnRango(horario, filtros.rangoHorario))
          .filter((horario) => !this.tieneReservaActiva(cancha, horario, reservas))
          .map((horario) => ({
            id: horario.id,
            nombre: horario.nombre,
            inicio: horario.fechaInicio,
            fin: horario.fechaFin,
            activo: horario.activo,
          }));

        return {
          canchaId: cancha.id,
          nombre: cancha.nombre,
          estado: cancha.estado,
          ubicacion: cancha.ubicacion,
          disponible: horariosDisponibles.length > 0,
          horariosDisponibles,
        };
      });

    const disponibles = resultados.filter((item) => item.disponible);

    return {
      fecha: filtros.fecha,
      canchaId: filtros.canchaId || null,
      rangoHorario: filtros.rangoHorario || null,
      totalCanchas: resultados.length,
      totalDisponibles: disponibles.length,
      canchas: resultados,
      mensaje: disponibles.length > 0
        ? 'Se encontraron canchas con disponibilidad para la fecha consultada.'
        : 'No hay disponibilidad para la fecha consultada en este momento.',
    };
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

  private horarioEnRango(horario: HorarioEntity, rangoHorario?: string): boolean {
    if (!rangoHorario) {
      return true;
    }

    const [inicioRango, finRango] = rangoHorario.split('-').map((value) => value.trim());
    if (!inicioRango || !finRango) {
      return true;
    }

    const horarioInicio = horario.fechaInicio.toTimeString().slice(0, 5);
    const horarioFin = horario.fechaFin.toTimeString().slice(0, 5);

    return horarioInicio >= inicioRango && horarioFin <= finRango;
  }

  private tieneReservaActiva(cancha: CanchaEntity, horario: HorarioEntity, reservas: ReservaEntity[]): boolean {
    const nombreCancha = this.normalizarTexto(cancha.nombre);
    const rangoHorario = this.formatearRangoHorario(horario);

    return reservas.some(
      (reserva) =>
        this.normalizarTexto(reserva.cancha) === nombreCancha &&
        reserva.hora === rangoHorario &&
        this.isActiveReservation(reserva),
    );
  }

  private formatearRangoHorario(horario: HorarioEntity): string {
    const inicio = horario.fechaInicio.toTimeString().slice(0, 5);
    const fin = horario.fechaFin.toTimeString().slice(0, 5);
    return `${inicio} - ${fin}`;
  }

  private isActiveReservation(reserva: ReservaEntity): boolean {
    return reserva.estado === ReservaEstado.PENDIENTE || reserva.estado === ReservaEstado.CONFIRMADA;
  }

  private normalizarTexto(valor: string): string {
    return valor.trim().toLowerCase();
  }
}
