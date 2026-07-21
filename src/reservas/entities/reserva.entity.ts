import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ClienteEntity } from '../../clientes/entities/cliente.entity';
import { CanchaEntity } from '../../canchas/entities/cancha.entity';
import { HorarioEntity } from '../../horarios/entities/horario.entity';

export enum ReservaEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  RECHAZADA = 'rechazada',
  COMPLETADA = 'completada',
}

@Entity('reservas')
export class ReservaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  clienteId!: string;

  @ManyToOne(() => ClienteEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'clienteId' })
  cliente!: ClienteEntity;

  @Column({ type: 'uuid' })
  canchaId!: string;

  @ManyToOne(() => CanchaEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'canchaId' })
  cancha!: CanchaEntity;

  @Column({ type: 'uuid' })
  horarioId!: string;

  @ManyToOne(() => HorarioEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'horarioId' })
  horario!: HorarioEntity;

  @Column({ type: 'timestamp' })
  fechaReserva!: Date;

  @Column({ type: 'enum', enum: ReservaEstado, default: ReservaEstado.PENDIENTE })
  estado!: ReservaEstado;

  @Column({ type: 'timestamp', nullable: true })
  fechaConfirmacion?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivoCancelacion?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
