import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { ReservaEntity } from '../reservas/entities/reserva.entity';


export enum UserRole {

  CLIENT = 'client',

  ADMIN = 'admin',

}


@Entity('users')
export class User {


  @PrimaryGeneratedColumn('uuid')
  id!: string;



  @Column({
    length: 100,
  })
  name!: string;



  @Column({
    length: 150,
    unique: true,
  })
  email!: string;



  @Column({
    select: false,
  })
  password!: string;



  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role!: UserRole;



  @Column({
    type: 'text',
    nullable: true,
  })
  profile?: string;



  @Column({
    default: true,
  })
  active!: boolean;



  @OneToMany(
    () => ReservaEntity,
    (reserva) => reserva.cliente,
  )
  reservas!: ReservaEntity[];



  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;



  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;


}