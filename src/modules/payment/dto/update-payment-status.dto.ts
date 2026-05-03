import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentStatusDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
