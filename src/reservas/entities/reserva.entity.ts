import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservas')
export class ReservaEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  clienteId!: string;

  @Column({ length: 100 })
  canchaId!: string;

  @Column({ type: 'timestamp' })
  fechaReserva!: Date;

  @Column({ length: 50 })
  estado!: string;

  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro!: Date;
}
