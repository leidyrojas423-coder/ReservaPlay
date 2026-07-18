import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdministradorEntity } from '../../administradores/entities/administrador.entity';

@Entity('canchas')
export class CanchaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 250, nullable: true })
  descripcion?: string;

  @Column({ length: 100 })
  ubicacion!: string;

  @Column({ length: 50, default: 'Disponible' })
  estado!: string;

  @Column({ type: 'int', nullable: true })
  capacidad?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio?: number;

  @Column({ default: true })
  activo!: boolean;

  @Column({ type: 'uuid' })
  administradorId!: string;

  @ManyToOne(() => AdministradorEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'administradorId' })
  administrador?: AdministradorEntity;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
