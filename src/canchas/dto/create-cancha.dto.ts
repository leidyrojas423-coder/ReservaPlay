import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

import { CanchaEstado } from '../entities/cancha.entity';



export class CreateCanchaDto {


  @IsString()
  @MaxLength(100)
  nombre!: string;



  @IsOptional()
  @IsString()
  descripcion?: string;



  @IsString()
  @MaxLength(150)
  ubicacion!: string;



  @IsOptional()
  @IsEnum(CanchaEstado)
  estado?: CanchaEstado;



  @IsOptional()
  @IsInt()
  capacidad?: number;



  @IsOptional()
  @IsNumber()
  precio?: number;



  @IsOptional()
  @IsUUID()
  administradorId?: string;



  @IsOptional()
  activo?: boolean;


}