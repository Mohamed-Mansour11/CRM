import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateDealDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid Lead ID format' })
  lead_id!: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid Property ID format' })
  property_id!: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  assigned_to?: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Amount cannot be negative' })
  amount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
