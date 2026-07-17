import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HorarioEntity } from '../../horarios/entities/horario.entity';

@Entity('reservas')
export class ReservaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  clienteId!: string;

  @Column({ length: 100 })
  canchaId!: string;

  @Column({ type: 'uuid', nullable: true })
  horarioId?: string;

  @Column({ type: 'timestamp' })
  fechaReserva!: Date;

  @Column({ length: 50 })
  estado!: string;

  @ManyToOne(() => HorarioEntity, (horario) => horario.reservas, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'horarioId' })
  horario?: HorarioEntity;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
