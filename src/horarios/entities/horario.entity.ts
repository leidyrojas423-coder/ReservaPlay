import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CanchaEntity } from '../../canchas/entities/cancha.entity';

@Entity('horarios')
export class HorarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 200, nullable: true })
  descripcion?: string;

  @Column({ type: 'timestamp with time zone' })
  fechaInicio!: Date;

  @Column({ type: 'timestamp with time zone' })
  fechaFin!: Date;

  @Column({ default: true })
  activo!: boolean;

  @Column({ type: 'uuid', nullable: true })
  canchaId?: string;

  @ManyToOne(() => CanchaEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'canchaId' })
  cancha?: CanchaEntity;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
