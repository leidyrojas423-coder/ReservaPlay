import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';


export class RegisterDto {


  @IsString()
  @IsNotEmpty()
  name!: string;


  @IsEmail()
  email!: string;


  @IsString()
  @MinLength(6)
  password!: string;


  @IsString()
  @IsNotEmpty()
  nombre!: string;


  @IsString()
  @IsNotEmpty()
  apellido!: string;


  @IsString()
  @IsNotEmpty()
  documento!: string;


  @IsString()
  @IsNotEmpty()
  telefono!: string;


  @IsString()
  profile?: string;

}