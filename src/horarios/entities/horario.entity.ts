import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('horarios')
export class HorarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100 })
  descripcion!: string;

  @Column({ type: 'time' })
  horaInicio!: string;

  @Column({ type: 'time' })
  horaFin!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
