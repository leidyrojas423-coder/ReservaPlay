import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  telefono!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  estado?: boolean;
}
