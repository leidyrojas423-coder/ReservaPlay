import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @Column({ type: 'uuid' })
  canchaId!: string;

  @ManyToOne(() => CanchaEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'canchaId' })
  cancha!: CanchaEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
