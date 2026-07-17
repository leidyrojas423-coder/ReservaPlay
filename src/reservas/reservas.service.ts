import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { ReservaEntity, ReservaEstado } from './entities/reserva.entity';

@Injectable()
export class ReservasService {
	constructor(
		@InjectRepository(ReservaEntity)
		private readonly reservasRepository: Repository<ReservaEntity>,
	) {}

	async findByClient(clienteId: string): Promise<ReservaEntity[]> {
		return this.reservasRepository.find({
			where: { clienteId },
			order: { fechaRegistro: 'DESC' },
		});
	}

	async create(clienteId: string, createReservaDto: CreateReservaDto): Promise<ReservaEntity> {
		const reserva = this.reservasRepository.create({
			clienteId,
			cancha: createReservaDto.cancha,
			fecha: createReservaDto.fecha,
			hora: createReservaDto.hora,
			monto: createReservaDto.monto,
			estado: ReservaEstado.PENDIENTE,
		});

		return this.reservasRepository.save(reserva);
	}

	async confirm(clienteId: string, id: string): Promise<ReservaEntity> {
		const reserva = await this.findOwnedReserva(clienteId, id);

		if (reserva.estado !== ReservaEstado.PENDIENTE) {
			throw new BadRequestException('Solo reservas Pendientes pueden confirmarse');
		}

		reserva.estado = ReservaEstado.CONFIRMADA;
		return this.reservasRepository.save(reserva);
	}

	async cancel(clienteId: string, id: string): Promise<ReservaEntity> {
		const reserva = await this.findOwnedReserva(clienteId, id);

		if (reserva.estado === ReservaEstado.CANCELADA || reserva.estado === ReservaEstado.FINALIZADA) {
			throw new BadRequestException('La reserva ya no puede cancelarse');
		}

		if (reserva.estado === ReservaEstado.CONFIRMADA && this.hoursUntilReserva(reserva) < 24) {
			throw new BadRequestException(
				'Faltan menos de 24 horas y la reserva esta Confirmada. Debes ir al punto fisico.',
			);
		}

		reserva.estado = ReservaEstado.CANCELADA;
		return this.reservasRepository.save(reserva);
	}

	private async findOwnedReserva(clienteId: string, id: string): Promise<ReservaEntity> {
		const reserva = await this.reservasRepository.findOne({ where: { id } });

		if (!reserva) {
			throw new NotFoundException('Reserva no encontrada');
		}

		if (reserva.clienteId !== clienteId) {
			throw new ForbiddenException('No puedes gestionar reservas de otro usuario');
		}

		return reserva;
	}

	private hoursUntilReserva(reserva: ReservaEntity): number {
		const startHour = reserva.hora.split('-')[0]?.trim() ?? '00:00';
		const fechaHora = new Date(`${reserva.fecha}T${startHour}:00`);

		if (Number.isNaN(fechaHora.getTime())) {
			return Number.POSITIVE_INFINITY;
		}

		return (fechaHora.getTime() - Date.now()) / (1000 * 60 * 60);
	}
}
