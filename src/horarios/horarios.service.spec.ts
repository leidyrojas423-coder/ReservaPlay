import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HorariosService } from './horarios.service';
import { HorarioEntity } from './entities/horario.entity';
import { CanchaEntity } from '../canchas/entities/cancha.entity';
import { ReservaEntity } from '../reservas/entities/reserva.entity';

describe('HorariosService', () => {
  let service: HorariosService;
  let horariosRepository: { create: jest.Mock; save: jest.Mock; find: jest.Mock; findOne: jest.Mock; update: jest.Mock; delete: jest.Mock };
  let canchasRepository: { findOne: jest.Mock };
  let reservasRepository: { find: jest.Mock };

  beforeEach(async () => {
    horariosRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    canchasRepository = {
      findOne: jest.fn(),
    };

    reservasRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HorariosService,
        {
          provide: getRepositoryToken(HorarioEntity),
          useValue: horariosRepository,
        },
        {
          provide: getRepositoryToken(CanchaEntity),
          useValue: canchasRepository,
        },
        {
          provide: getRepositoryToken(ReservaEntity),
          useValue: reservasRepository,
        },
      ],
    }).compile();

    service = module.get<HorariosService>(HorariosService);
  });

  it('should reject overlapping active schedules on the same cancha', async () => {
    const base = new Date(Date.now() + 60 * 60 * 1000);
    const start = new Date(base.getTime() + 60 * 60 * 1000);
    const end = new Date(base.getTime() + 2 * 60 * 60 * 1000);

    canchasRepository.findOne.mockResolvedValue({ id: 'cancha-1' });
    horariosRepository.find.mockResolvedValue([
      {
        id: 'existing-1',
        canchaId: 'cancha-1',
        activo: true,
        fechaInicio: base,
        fechaFin: end,
      },
    ]);

    await expect(
      service.create({
        canchaId: 'cancha-1',
        nombre: 'Mañana',
        descripcion: 'Horario de prueba',
        fechaInicio: start.toISOString(),
        fechaFin: new Date(end.getTime() + 60 * 60 * 1000).toISOString(),
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should reject schedules in the past', async () => {
    canchasRepository.findOne.mockResolvedValue({ id: 'cancha-1' });
    horariosRepository.find.mockResolvedValue([]);

    const pastStart = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const pastEnd = new Date(Date.now() - 60 * 60 * 1000);

    await expect(
      service.create({
        canchaId: 'cancha-1',
        nombre: 'Pasado',
        descripcion: 'Horario vencido',
        fechaInicio: pastStart.toISOString(),
        fechaFin: pastEnd.toISOString(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should block deleting a horario with active reservations', async () => {
    horariosRepository.findOne.mockResolvedValue({ id: 'horario-1' });
    reservasRepository.find.mockResolvedValue([{ id: 'reserva-1', estado: 'confirmada' }]);

    await expect(service.remove('horario-1')).rejects.toThrow(ConflictException);
  });
});
