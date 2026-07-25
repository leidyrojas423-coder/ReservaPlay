import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AdministradorEntity } from '../../administradores/entities/administrador.entity';


export enum CanchaEstado {
  DISPONIBLE = 'Disponible',
  OCUPADA = 'Ocupada',
  MANTENIMIENTO = 'Mantenimiento',
}


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


  @Column({ type: 'int', nullable: true })
  capacidad?: number;


  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  precio?: number;


  @Column({ default: true })
  activo!: boolean;


  /**
   * Estado actual de la cancha:
   * Disponible
   * Ocupada
   * Mantenimiento
   */
  @Column({
    type: 'enum',
    enum: CanchaEstado,
    default: CanchaEstado.DISPONIBLE,
  })
  estado!: CanchaEstado;


  @Column({ type: 'uuid' })
  administradorId!: string;


  @ManyToOne(() => AdministradorEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'administradorId' })
  administrador!: AdministradorEntity;


  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;


  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

}