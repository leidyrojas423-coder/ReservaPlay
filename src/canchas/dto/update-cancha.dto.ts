import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class UpdateCanchaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Disponible', 'Ocupada', 'Mantenimiento'])
  estado?: string;

  @IsUUID()
  @IsOptional()
  administradorId?: string;

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
