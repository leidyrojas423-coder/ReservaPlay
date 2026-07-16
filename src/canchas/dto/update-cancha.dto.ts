import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCanchaDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
