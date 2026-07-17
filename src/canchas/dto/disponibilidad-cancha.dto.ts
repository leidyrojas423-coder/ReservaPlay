import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class DisponibilidadCanchaDto {
  @IsDateString()
  fecha!: string;

  @IsUUID()
  @IsOptional()
  canchaId?: string;

  @IsString()
  @IsOptional()
  rangoHorario?: string;
}
