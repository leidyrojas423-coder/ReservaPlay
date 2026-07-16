import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CanchasService } from './canchas.service';
import { CanchaEntity } from './entities/cancha.entity';

describe('CanchasService', () => {
  let service: CanchasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CanchasService,
        {
          provide: getRepositoryToken(CanchaEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CanchasService>(CanchasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
