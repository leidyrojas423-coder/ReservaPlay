import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateReservaDto {
  @IsString()
  @IsNotEmpty()
  cancha!: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}\s-\s\d{2}:\d{2}$/)
  hora!: string;

  @IsString()
  @IsNotEmpty()
  monto!: string;
}
