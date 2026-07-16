import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHorarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  horaInicio!: string;

  @IsString()
  @IsNotEmpty()
  horaFin!: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
