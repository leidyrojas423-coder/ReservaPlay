import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('clientes')
export class ClienteEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  apellido!: string;

  @Column({ length: 150, unique: true })
  correo!: string;

  @Column({ length: 20 })
  telefono!: string;

  @Column({ select: false })
  password!: string;

  @Column({ default: true })
  estado!: boolean;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
