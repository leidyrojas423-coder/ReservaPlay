import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelReservaDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  motivo?: string;
}
