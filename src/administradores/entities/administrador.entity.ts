import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('administradores')
export class AdministradorEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;


  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre!: string;


  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  correo!: string;


  @Column({
    type: 'varchar',
    length: 255,
  })
  password!: string;


  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt!: Date;


  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt!: Date;

}