import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('canchas')
export class CanchaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  ubicacion!: string;

  @Column({ length: 50 })
  tipo!: string;

  @Column({ default: true })
  disponible!: boolean;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
