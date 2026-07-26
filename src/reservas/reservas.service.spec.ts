import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ReservasService } from './reservas.service';

import { ReservaEntity } from './entities/reserva.entity';
import { ClienteEntity } from '../clientes/entities/cliente.entity';
import { CanchaEntity } from '../canchas/entities/cancha.entity';
import { HorarioEntity } from '../horarios/entities/horario.entity';



describe('ReservasService', () => {

  let service: ReservasService;



  beforeEach(async () => {


    const module: TestingModule =
      await Test.createTestingModule({

        providers:[

          ReservasService,


          {
            provide:getRepositoryToken(ReservaEntity),

            useValue:{

              find:jest.fn(),

              findOne:jest.fn(),

              create:jest.fn(),

              save:jest.fn(),

              count:jest.fn(),

            },

          },


          {
            provide:getRepositoryToken(ClienteEntity),

            useValue:{},

          },


          {
            provide:getRepositoryToken(CanchaEntity),

            useValue:{},

          },


          {
            provide:getRepositoryToken(HorarioEntity),

            useValue:{},

          },


        ],

      }).compile();



    service =
      module.get<ReservasService>(
        ReservasService
      );


  });





  it('should be defined',()=>{


    expect(service)
      .toBeDefined();


  });



});