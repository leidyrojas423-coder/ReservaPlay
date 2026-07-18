import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'enum', enum: ReservaEstado, default: ReservaEstado.PENDIENTE })
  estado!: ReservaEstado;

  @Column({ type: 'text', nullable: true })
  motivoCancelacion!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  canceladaEn!: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  canceladaPor!: string | null;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
