import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateAdministradorDto } from './dto/create-administrador.dto';
import { UpdateAdministradorDto } from './dto/update-administrador.dto';
import { AdministradoresService } from './administradores.service';

@Controller('administradores')
export class AdministradoresController {
  constructor(private readonly administradoresService: AdministradoresService) {}

  @Post()
  async create(@Body() createAdministradorDto: CreateAdministradorDto) {
    return this.administradoresService.create(createAdministradorDto);
  }

  @Get()
  async findAll() {
    return this.administradoresService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAdministradorDto: UpdateAdministradorDto) {
    return this.administradoresService.update(id, updateAdministradorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.administradoresService.remove(id);
  }
}
