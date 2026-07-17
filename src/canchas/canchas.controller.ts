import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { CanchasService } from './canchas.service';

@Controller('canchas')
export class CanchasController {
  constructor(private readonly canchasService: CanchasService) {}

  @Post()
  async create(@Body() createCanchaDto: CreateCanchaDto) {
    return this.canchasService.create(createCanchaDto);
  }

  @Get()
  async findAll() {
    return this.canchasService.findAll();
  }

  @Get('disponibles')
  async findDisponibles() {
    return this.canchasService.findDisponibles();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCanchaDto: UpdateCanchaDto) {
    return this.canchasService.update(id, updateCanchaDto);
  }

  @Patch(':id/desactivar')
  async deactivate(@Param('id') id: string) {
    return this.canchasService.deactivate(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.canchasService.remove(id);
  }
}
