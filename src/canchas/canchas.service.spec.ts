import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CanchasService } from './canchas.service';
import { CanchaEntity } from './entities/cancha.entity';

describe('CanchasService', () => {
  let service: CanchasService;
  let createMock: jest.Mock;
  let saveMock: jest.Mock;

  beforeEach(async () => {
    createMock = jest.fn((dto) => dto);
    saveMock = jest.fn().mockResolvedValue({ id: '1', ...createMock.mock.results[0]?.value });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CanchasService,
        {
          provide: getRepositoryToken(CanchaEntity),
          useValue: {
            create: createMock,
            save: saveMock,
          },
        },
      ],
    }).compile();

    service = module.get<CanchasService>(CanchasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debe crear una cancha con estado, activo y administradorId', async () => {
    const result = await service.create({
      nombre: 'Cancha 1',
      ubicacion: 'Zona Norte',
      estado: 'Disponible',
      activo: true,
      administradorId: 'admin-1',
    });

    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
      nombre: 'Cancha 1',
      estado: 'Disponible',
      activo: true,
      administradorId: 'admin-1',
    }));
    expect(saveMock).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
