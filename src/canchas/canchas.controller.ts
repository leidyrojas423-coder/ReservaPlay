import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('canchas')
export class CanchasController {
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  @Get()
  findAll() {
    return { message: 'Consulta de canchas para clientes' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create() {
    return { message: 'Crear cancha' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update() {
    return { message: 'Actualizar cancha' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove() {
    return { message: 'Eliminar o desactivar cancha' };
  }
}
