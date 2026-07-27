import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HorarioEntity } from './entities/horario.entity';

import { CanchaEntity } from '../canchas/entities/cancha.entity';

import { CreateHorarioDto } from './dto/create-horario.dto';

import { UpdateHorarioDto } from './dto/update-horario.dto';


@Injectable()
export class HorariosService {


  constructor(

    @InjectRepository(HorarioEntity)
    private readonly horariosRepository: Repository<HorarioEntity>,


    @InjectRepository(CanchaEntity)
    private readonly canchasRepository: Repository<CanchaEntity>,


  ) {}




  async create(
    createHorarioDto: CreateHorarioDto
  ): Promise<HorarioEntity> {


    const cancha =
      await this.canchasRepository.findOne({

        where:{
          id:createHorarioDto.canchaId
        }

      });


    if(!cancha){

      throw new NotFoundException(
        'Cancha no encontrada'
      );

    }



    const horario =
      this.horariosRepository.create({

        ...createHorarioDto,

        fechaInicio:
        new Date(createHorarioDto.fechaInicio),

        fechaFin:
        new Date(createHorarioDto.fechaFin),

        activo:
        createHorarioDto.activo ?? true,

      });



    try{

      return await this.horariosRepository.save(horario);


    }catch(error){

      throw new InternalServerErrorException(
        'No se pudo crear el horario'
      );

    }

  }






  async findAll(): Promise<HorarioEntity[]> {


    return this.horariosRepository.find({

      where:{
        activo:true
      },


      relations:[

        'cancha'

      ],


      order:{

        fechaInicio:'ASC'

      }


    });


  }






  async findByCancha(
    canchaId:string
  ):Promise<HorarioEntity[]> {


    return this.horariosRepository.find({

      where:{

        canchaId,

        activo:true

      },


      order:{

        fechaInicio:'ASC'

      }


    });


  }






  async findOne(
    id:string
  ):Promise<HorarioEntity>{


    const horario =
      await this.horariosRepository.findOne({

        where:{
          id
        },

        relations:[
          'cancha'
        ]

      });



    if(!horario){

      throw new NotFoundException(
        'Horario no encontrado'
      );

    }


    return horario;


  }






  async update(
    id:string,
    updateHorarioDto:UpdateHorarioDto
  ){


    await this.findOne(id);


    await this.horariosRepository.update(

      id,

      {

        ...updateHorarioDto,

        fechaInicio:
        updateHorarioDto.fechaInicio
        ?
        new Date(updateHorarioDto.fechaInicio)
        :
        undefined,


        fechaFin:
        updateHorarioDto.fechaFin
        ?
        new Date(updateHorarioDto.fechaFin)
        :
        undefined,

      }

    );


    return this.findOne(id);


  }






  async deactivate(
    id:string
  ){


    const horario =
      await this.findOne(id);



    horario.activo=false;


    return this.horariosRepository.save(horario);


  }






  async remove(
    id:string
  ){


    const horario =
      await this.findOne(id);


    await this.horariosRepository.delete(id);


    return {

      message:'Horario eliminado'

    };


  }


}