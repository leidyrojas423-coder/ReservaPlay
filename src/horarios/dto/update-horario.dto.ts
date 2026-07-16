import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateHorarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  horaInicio?: string;

  @IsString()
  @IsOptional()
  horaFin?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
