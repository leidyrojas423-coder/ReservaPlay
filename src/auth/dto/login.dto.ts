import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
