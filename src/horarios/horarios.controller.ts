import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { HorariosService } from './horarios.service';

@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Post()
  async create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Get()
  async findAll() {
    return this.horariosService.findAll();
  }

  @Get('cancha/:canchaId')
  async findByCancha(@Param('canchaId') canchaId: string) {
    return this.horariosService.findByCancha(canchaId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(id, updateHorarioDto);
  }

  @Patch(':id/desactivar')
  async deactivate(@Param('id') id: string) {
    return this.horariosService.deactivate(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.horariosService.remove(id);
  }
}
