import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CanchasService } from './canchas.service';
import { CanchaEntity } from './entities/cancha.entity';
import { AdministradorEntity } from '../administradores/entities/administrador.entity';
import { HorarioEntity } from '../horarios/entities/horario.entity';
import { ReservaEntity } from '../reservas/entities/reserva.entity';

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
        {
          provide: getRepositoryToken(AdministradorEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(HorarioEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ReservaEntity),
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
