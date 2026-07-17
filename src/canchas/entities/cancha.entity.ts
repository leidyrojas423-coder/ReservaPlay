import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('canchas')
export class CanchaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 255, nullable: true })
  descripcion?: string;

  @Column({ length: 100 })
  ubicacion!: string;

  @Column({ length: 20, default: 'Disponible' })
  estado!: string;

  @Column({ type: 'int', nullable: true })
  capacidad?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio?: number;

  @Column({ default: true })
  activo!: boolean;

  @Column({ default: true })
  disponible!: boolean;

  @Column({ name: 'administrador_id', nullable: true })
  administradorId?: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
