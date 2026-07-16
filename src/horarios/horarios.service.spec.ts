import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorariosService } from './horarios.service';
import { HorarioEntity } from './entities/horario.entity';

describe('HorariosService', () => {
  let service: HorariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HorariosService,
        {
          provide: getRepositoryToken(HorarioEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<HorariosService>(HorariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
