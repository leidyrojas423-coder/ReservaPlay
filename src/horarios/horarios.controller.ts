import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('horarios')
export class HorariosController {
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  @Get()
  findAll() {
    return { message: 'Consulta de horarios para clientes' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create() {
    return { message: 'Crear horario' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id')
  update() {
    return { message: 'Actualizar horario' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove() {
    return { message: 'Eliminar horario' };
  }
}
