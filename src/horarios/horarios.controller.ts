import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHorarioDto: UpdateHorarioDto) {
    return this.horariosService.update(id, updateHorarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.horariosService.remove(id);
  }
}
