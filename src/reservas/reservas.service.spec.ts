import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservaEntity, ReservaEstado } from './entities/reserva.entity';

type MockRepo = {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOne: jest.Mock;
};

const makeReserva = (partial: Partial<ReservaEntity> = {}): ReservaEntity => ({
  id: partial.id ?? 'res-1',
  clienteId: partial.clienteId ?? 'cli-1',
  cancha: partial.cancha ?? 'Cancha 1',
  fecha: partial.fecha ?? '2026-07-20',
  hora: partial.hora ?? '18:00 - 19:00',
  monto: partial.monto ?? '$120.000',
  estado: partial.estado ?? ReservaEstado.PENDIENTE,
  fechaRegistro: partial.fechaRegistro ?? new Date('2026-07-17T10:00:00Z'),
});

describe('ReservasService', () => {
  let service: ReservasService;
  let repo: MockRepo;

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservasService,
        {
          provide: getRepositoryToken(ReservaEntity),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<ReservasService>(ReservasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crea una reserva en estado Pendiente', async () => {
    const dto = {
      cancha: 'Cancha 2',
      fecha: '2026-07-21',
      hora: '20:00 - 21:00',
      monto: '$165.000',
    };
    const creada = makeReserva({
      cancha: dto.cancha,
      fecha: dto.fecha,
      hora: dto.hora,
      monto: dto.monto,
      estado: ReservaEstado.PENDIENTE,
    });

    repo.create.mockReturnValue(creada);
    repo.save.mockResolvedValue(creada);

    const result = await service.create('cli-1', dto);

    expect(repo.create).toHaveBeenCalledWith({
      clienteId: 'cli-1',
      cancha: dto.cancha,
      fecha: dto.fecha,
      hora: dto.hora,
      monto: dto.monto,
      estado: ReservaEstado.PENDIENTE,
    });
    expect(result.estado).toBe(ReservaEstado.PENDIENTE);
  });

  it('permite confirmar solo reservas Pendientes del mismo cliente', async () => {
    const pendiente = makeReserva({ estado: ReservaEstado.PENDIENTE, clienteId: 'cli-1' });
    repo.findOne.mockResolvedValue(pendiente);
    repo.save.mockResolvedValue({ ...pendiente, estado: ReservaEstado.CONFIRMADA });

    const result = await service.confirm('cli-1', 'res-1');

    expect(result.estado).toBe(ReservaEstado.CONFIRMADA);
    expect(repo.save).toHaveBeenCalled();
  });

  it('rechaza confirmar reservas en estado distinto a Pendiente', async () => {
    const confirmada = makeReserva({ estado: ReservaEstado.CONFIRMADA, clienteId: 'cli-1' });
    repo.findOne.mockResolvedValue(confirmada);

    await expect(service.confirm('cli-1', 'res-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('permite cancelar una Confirmada cuando faltan 24h o mas', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-18T17:00:00Z'));

    const confirmada = makeReserva({
      estado: ReservaEstado.CONFIRMADA,
      clienteId: 'cli-1',
      fecha: '2026-07-19',
      hora: '18:00 - 19:00',
    });

    repo.findOne.mockResolvedValue(confirmada);
    repo.save.mockResolvedValue({ ...confirmada, estado: ReservaEstado.CANCELADA });

    const result = await service.cancel('cli-1', 'res-1');
    expect(result.estado).toBe(ReservaEstado.CANCELADA);

    jest.useRealTimers();
  });

  it('rechaza cancelar Confirmada cuando faltan menos de 24h', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-19T00:30:00Z'));

    const confirmada = makeReserva({
      estado: ReservaEstado.CONFIRMADA,
      clienteId: 'cli-1',
      fecha: '2026-07-19',
      hora: '18:00 - 19:00',
    });

    repo.findOne.mockResolvedValue(confirmada);

    await expect(service.cancel('cli-1', 'res-1')).rejects.toBeInstanceOf(BadRequestException);

    jest.useRealTimers();
  });

  it('impide gestionar reservas de otro cliente', async () => {
    const pendiente = makeReserva({ clienteId: 'cli-otro' });
    repo.findOne.mockResolvedValue(pendiente);

    await expect(service.confirm('cli-1', 'res-1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('lanza NotFound cuando no existe la reserva', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.cancel('cli-1', 'res-inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });
});
