import { IsDateString, IsUUID } from 'class-validator';


export class CreateReservaDto {


  @IsUUID()
  canchaId!: string;


  @IsUUID()
  horarioId!: string;


  @IsDateString()
  fechaReserva!: string;


}