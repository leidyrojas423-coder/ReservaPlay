import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('reservas')
export class ReservasController {
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  @Post()
  create() {
    return { message: 'Crear reserva para cliente' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  @Get('me')
  findMyReservations() {
    return { message: 'Listar reservas propias del cliente' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return { message: 'Listar todas las reservas para admin' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/status')
  updateStatus() {
    return { message: 'Cambiar estado de reserva' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  @Delete(':id')
  cancel() {
    return { message: 'Cancelar reserva propia' };
  }
}
