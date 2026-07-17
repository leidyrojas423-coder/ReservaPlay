import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { ReservasService } from './reservas.service';

@Controller('reservas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('client')
export class ReservasController {
	constructor(private readonly reservasService: ReservasService) {}

	@Get('mias')
	async findMine(@Request() req: ExpressRequest) {
		return this.reservasService.findByClient((req.user as any).userId);
	}

	@Post()
	async create(@Request() req: ExpressRequest, @Body() createReservaDto: CreateReservaDto) {
		return this.reservasService.create((req.user as any).userId, createReservaDto);
	}

	@Patch(':id/confirmar')
	async confirm(@Request() req: ExpressRequest, @Param('id') id: string) {
		return this.reservasService.confirm((req.user as any).userId, id);
	}

	@Patch(':id/cancelar')
	async cancel(@Request() req: ExpressRequest, @Param('id') id: string) {
		return this.reservasService.cancel((req.user as any).userId, id);
	}
}
