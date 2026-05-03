import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaymentType } from 'src/DB/models/payment.model';

export class CreatePaymentDto {
  @IsEnum(PaymentType)
  @IsNotEmpty()
  type!: PaymentType;

  @IsNumber()
  @IsOptional()
  installmentNumber?: number; // رقم القسط (للتنظيم)

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount!: number;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  dueDate!: Date; // تاريخ استحقاق الدفعة

  @IsString()
  @IsOptional()
  notes?: string;
}
