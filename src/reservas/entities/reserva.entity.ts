import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HorarioEntity } from '../../horarios/entities/horario.entity';

export enum ReservaEstado {
  PENDIENTE = 'Pendiente',
  CONFIRMADA = 'Confirmada',
  FINALIZADA = 'Finalizada',
  CANCELADA = 'Cancelada',
}

@Entity('reservas')
export class ReservaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  clienteId!: string;

  @Column({ length: 150 })
  cancha!: string;

  @Column({ length: 10 })
  fecha!: string;

  @Column({ length: 30 })
  hora!: string;

  @Column({ length: 30 })
  monto!: string;

  @Column({ type: 'uuid', nullable: true })
  horarioId?: string;

  @ManyToOne(() => HorarioEntity, (horario) => horario.reservas, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'horarioId' })
  horario?: HorarioEntity;

  @Column({ type: 'enum', enum: ReservaEstado, default: ReservaEstado.PENDIENTE })
  estado!: ReservaEstado;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
