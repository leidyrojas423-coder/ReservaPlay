import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateCanchaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  ubicacion!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Disponible', 'Ocupada', 'Mantenimiento'])
  estado!: string;

  @IsUUID()
  @IsNotEmpty()
  administradorId!: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  capacidad?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  precio?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
