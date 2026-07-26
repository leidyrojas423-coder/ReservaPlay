import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { HorarioEntity } from '../horarios/entities/horario.entity';

import {
  ReservaEntity,
  ReservaEstado,
} from '../reservas/entities/reserva.entity';

import { CreateCanchaDto } from './dto/create-cancha.dto';
import { DisponibilidadCanchaDto } from './dto/disponibilidad-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';

import {
  CanchaEntity,
  CanchaEstado,
} from './entities/cancha.entity';



@Injectable()
export class CanchasService {


  constructor(

    @InjectRepository(CanchaEntity)
    private readonly canchasRepository: Repository<CanchaEntity>,


    @InjectRepository(AdministradorEntity)
    private readonly administradoresRepository: Repository<AdministradorEntity>,


    @InjectRepository(HorarioEntity)
    private readonly horariosRepository: Repository<HorarioEntity>,


    @InjectRepository(ReservaEntity)
    private readonly reservasRepository: Repository<ReservaEntity>,

  ) {}



  async create(
    createCanchaDto: CreateCanchaDto
  ): Promise<CanchaEntity> {


    if(createCanchaDto.administradorId){

      await this.validateAdministrador(
        createCanchaDto.administradorId
      );

    }



    const cancha =
      this.canchasRepository.create({

        ...createCanchaDto,

        activo:
          createCanchaDto.activo ?? true,

        estado:
          CanchaEstado.DISPONIBLE,

      });



    try{

      return await this.canchasRepository.save(cancha);


    }catch(error){

      throw new InternalServerErrorException(
        'No se pudo crear la cancha'
      );

    }


  }





  async findAll(): Promise<CanchaEntity[]> {


    return this.canchasRepository.find({

      where:{
        activo:true
      },

      relations:[
        'administrador'
      ],

      order:{
        nombre:'ASC'
      }

    });


  }





  async findOne(
    id:string
  ):Promise<CanchaEntity>{


    const cancha =
      await this.canchasRepository.findOne({

        where:{
          id
        },

        relations:[
          'administrador'
        ]

      });



    if(!cancha){

      throw new NotFoundException(
        'Cancha no encontrada'
      );

    }


    return cancha;


  }







  async update(
    id:string,
    updateCanchaDto:UpdateCanchaDto
  ):Promise<CanchaEntity>{


    const cancha =
      await this.findOne(id);



    await this.canchasRepository.update(

      id,

      {

        ...updateCanchaDto,


        activo:
          updateCanchaDto.activo ??
          cancha.activo,


        estado:
          (updateCanchaDto.estado as CanchaEstado)
          ??
          cancha.estado,


      }

    );


    return this.findOne(id);


  }







  async deactivate(
    id:string
  ):Promise<CanchaEntity>{


    const cancha =
      await this.findOne(id);



    cancha.estado =
      CanchaEstado.MANTENIMIENTO;



    return this.canchasRepository.save(cancha);


  }







  async consultarDisponibilidad(
    filtros:DisponibilidadCanchaDto
  ){


    const fecha =
      new Date(filtros.fecha);



    if(Number.isNaN(fecha.getTime())){

      throw new BadRequestException(
        'Fecha inválida'
      );

    }



    const canchas =
      await this.canchasRepository.find({

        where:{

          activo:true,

          estado:
            CanchaEstado.DISPONIBLE

        }

      });





    const horarios =
      await this.horariosRepository.find({

        where:{
          activo:true
        }

      });





    return {

      fecha:filtros.fecha,


      canchas:

      canchas.map(cancha=>({

        canchaId:
          cancha.id,

        nombre:
          cancha.nombre,

        ubicacion:
          cancha.ubicacion,


        horariosDisponibles:

          horarios.filter(

            horario =>
              horario.canchaId === cancha.id

          )

      }))


    };


  }







  async remove(
    id:string
  ):Promise<void>{


    const cancha =
      await this.findOne(id);



    const reservas =
      await this.reservasRepository.count({

        where:{

          canchaId:
            cancha.id,


          estado:
            ReservaEstado.PENDIENTE

        }

      });



    if(reservas > 0){

      throw new BadRequestException(

        'No se puede eliminar una cancha con reservas activas'

      );

    }



    await this.canchasRepository.delete(id);


  }







  private async validateAdministrador(
    administradorId:string
  ){


    const administrador =
      await this.administradoresRepository.findOne({

        where:{
          id:administradorId
        }

      });



    if(!administrador){

      throw new NotFoundException(

        'Administrador no encontrado'

      );

    }


  }


}