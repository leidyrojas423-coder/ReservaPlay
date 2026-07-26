import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CreateReservaDto } from './dto/create-reserva.dto';
import { CancelReservaDto } from './dto/cancel-reserva.dto';

import { ReservasService } from './reservas.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';



@Controller('reservas')
export class ReservasController {


  constructor(
    private readonly reservasService: ReservasService,
  ) {}




  // ADMINISTRADOR: todas las reservas

  @Get()
  async findAll(){

    return this.reservasService.findAll();

  }





  // CLIENTE: sus reservas

  @Get('mias')
  async findMine(){


    return this.reservasService.findByClient(

      '37e65aa3-ba11-4e13-8f1b-2bf7352da5cc'

    );


  }





  @Post()

  @UseGuards(JwtAuthGuard)

  async create(

    @Body() createReservaDto:CreateReservaDto,

    @Request() req:any,

  ){


    return this.reservasService.create(

      req.user.userId,

      createReservaDto,

    );


  }






  @Patch(':id/confirmar')

  async confirm(

    @Param('id') id:string,

  ){


    return this.reservasService.confirm(

      '37e65aa3-ba11-4e13-8f1b-2bf7352da5cc',

      id,

    );


  }






  @Patch(':id/cancelar')

  async cancel(

    @Param('id') id:string,

    @Body() cancelReservaDto:CancelReservaDto,

  ){


    return this.reservasService.cancel(

      '37e65aa3-ba11-4e13-8f1b-2bf7352da5cc',

      id,

      cancelReservaDto,

    );


  }


}