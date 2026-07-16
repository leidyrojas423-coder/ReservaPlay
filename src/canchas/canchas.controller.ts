import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCanchaDto: UpdateCanchaDto) {
    return this.canchasService.update(id, updateCanchaDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.canchasService.remove(id);
  }
}
