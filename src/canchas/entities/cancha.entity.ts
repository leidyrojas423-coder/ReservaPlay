import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { AdministradorEntity } from '../../administradores/entities/administrador.entity';
import { HorarioEntity } from '../../horarios/entities/horario.entity';


export enum CanchaEstado {

  DISPONIBLE = 'Disponible',

  OCUPADA = 'Ocupada',

  MANTENIMIENTO = 'Mantenimiento',

}


@Entity('canchas')
export class CanchaEntity {


  @PrimaryGeneratedColumn('uuid')
  id!: string;



  @Column({
    length: 100,
  })
  nombre!: string;



  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion?: string;



  @Column({
    length: 150,
  })
  ubicacion!: string;



  @Column({
    type: 'enum',
    enum: CanchaEstado,
    default: CanchaEstado.DISPONIBLE,
  })
  estado!: CanchaEstado;



  @Column({
    type: 'int',
    nullable: true,
  })
  capacidad?: number;



  @Column({
    type: 'decimal',
    nullable: true,
  })
  precio?: number;



  @Column({
    default: true,
  })
  activo!: boolean;



  @Column({
    type: 'uuid',
    nullable: true,
  })
  administradorId?: string;



  @ManyToOne(
    () => AdministradorEntity,
    {
      nullable: true,
      eager: false,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({
    name: 'administradorId',
  })
  administrador?: AdministradorEntity;



  @OneToMany(
    () => HorarioEntity,
    (horario) => horario.cancha,
  )
  horarios?: HorarioEntity[];



  @CreateDateColumn({
    name:'created_at',
  })
  createdAt!: Date;



  @UpdateDateColumn({
    name:'updated_at',
  })
  updatedAt!: Date;


}