import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdministradorDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  estado?: boolean;
}
