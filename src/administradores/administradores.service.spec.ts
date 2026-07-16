import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministradoresService } from './administradores.service';
import { AdministradorEntity } from './entities/administrador.entity';

describe('AdministradoresService', () => {
  let service: AdministradoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministradoresService,
        {
          provide: getRepositoryToken(AdministradorEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AdministradoresService>(AdministradoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
