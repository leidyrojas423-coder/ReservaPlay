import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCanchaDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  ubicacion!: string;

  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @IsBoolean()
  @IsOptional()
  disponible?: boolean;
}
