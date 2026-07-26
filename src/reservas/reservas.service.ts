import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateReservaDto } from './dto/create-reserva.dto';
import { CancelReservaDto } from './dto/cancel-reserva.dto';

import {
  ReservaEntity,
  ReservaEstado,
} from './entities/reserva.entity';

import { ClienteEntity } from '../clientes/entities/cliente.entity';

import {
  CanchaEntity,
  CanchaEstado,
} from '../canchas/entities/cancha.entity';

import { HorarioEntity } from '../horarios/entities/horario.entity';



@Injectable()
export class ReservasService {


  constructor(

    @InjectRepository(ReservaEntity)
    private readonly reservasRepository:
    Repository<ReservaEntity>,


    @InjectRepository(ClienteEntity)
    private readonly clientesRepository:
    Repository<ClienteEntity>,


    @InjectRepository(CanchaEntity)
    private readonly canchasRepository:
    Repository<CanchaEntity>,


    @InjectRepository(HorarioEntity)
    private readonly horariosRepository:
    Repository<HorarioEntity>,

  ) {}





  async findByClient(
    clienteId:string,
  ):Promise<ReservaEntity[]> {


    return this.reservasRepository.find({

      where:{
        clienteId,
      },

      order:{
        createdAt:'DESC',
      },

    });

  }








  async create(

    clienteId:string,

    createReservaDto:CreateReservaDto,

  ):Promise<ReservaEntity>{



    // VALIDAR CLIENTE

    const cliente =
      await this.clientesRepository.findOne({

        where:{
          id:clienteId,
        },

      });



    if(!cliente){

      throw new NotFoundException(
        'Cliente no encontrado',
      );

    }







    // VALIDAR CANCHA

    const cancha =
      await this.canchasRepository.findOne({

        where:{
          id:createReservaDto.canchaId,
        },

      });



    if(!cancha){

      throw new NotFoundException(
        'Cancha no encontrada',
      );

    }







    // VALIDAR ESTADO DE CANCHA

    if(
      cancha.estado !== CanchaEstado.DISPONIBLE
    ){

      throw new BadRequestException(
        'La cancha no está disponible',
      );

    }







    // VALIDAR HORARIO

    const horario =
      await this.horariosRepository.findOne({

        where:{
          id:createReservaDto.horarioId,
        },

      });



    if(!horario){

      throw new NotFoundException(
        'Horario no encontrado',
      );

    }







    // VALIDAR QUE EL HORARIO PERTENEZCA A LA CANCHA

    if(
      horario.canchaId !== cancha.id
    ){

      throw new BadRequestException(
        'El horario no pertenece a la cancha seleccionada',
      );

    }








    // VALIDAR DOBLE RESERVA

    const reservaExistente =
      await this.reservasRepository.findOne({

        where:{

          canchaId:createReservaDto.canchaId,

          horarioId:createReservaDto.horarioId,

          fechaReserva:
          new Date(createReservaDto.fechaReserva),

        },

      });





    if(reservaExistente){

      throw new BadRequestException(

        'Ya existe una reserva para esta cancha y horario',

      );

    }









    // CREAR RESERVA


    const reserva =
      this.reservasRepository.create({

        clienteId,

        canchaId:createReservaDto.canchaId,

        horarioId:createReservaDto.horarioId,

        fechaReserva:
        new Date(createReservaDto.fechaReserva),

        estado:
        ReservaEstado.PENDIENTE,

      });




    return this.reservasRepository.save(reserva);


  }









  async confirm(

    clienteId:string,

    id:string,

  ):Promise<ReservaEntity>{



    const reserva =
      await this.findOwnedReserva(
        clienteId,
        id,
      );





    if(
      reserva.estado !== ReservaEstado.PENDIENTE
    ){

      throw new BadRequestException(

        'Solo reservas pendientes pueden confirmarse',

      );

    }





    reserva.estado =
      ReservaEstado.CONFIRMADA;




    return this.reservasRepository.save(
      reserva
    );


  }









  async cancel(

    clienteId:string,

    id:string,

    cancelReservaDto:
    CancelReservaDto = {},

  ):Promise<ReservaEntity>{



    const reserva =
      await this.findOwnedReserva(

        clienteId,

        id,

      );






    if(

      reserva.estado === ReservaEstado.CANCELADA

      ||

      reserva.estado === ReservaEstado.COMPLETADA

    ){

      throw new BadRequestException(

        'La reserva ya no puede cancelarse',

      );

    }







    reserva.estado =
      ReservaEstado.CANCELADA;



    reserva.motivoCancelacion =

      cancelReservaDto.motivo?.trim()

      ||

      'Cancelada por el cliente';







    return this.reservasRepository.save(
      reserva
    );


  }









  private async findOwnedReserva(

    clienteId:string,

    id:string,

  ):Promise<ReservaEntity>{



    const reserva =
      await this.reservasRepository.findOne({

        where:{
          id,
        },

      });






    if(!reserva){

      throw new NotFoundException(
        'Reserva no encontrada',
      );

    }






    if(
      reserva.clienteId !== clienteId
    ){

      throw new ForbiddenException(

        'No puedes gestionar reservas de otro usuario',

      );

    }





    return reserva;


  }



}