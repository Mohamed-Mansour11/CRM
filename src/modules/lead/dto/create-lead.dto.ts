import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import {
  LeadSource,
  LeadStatus,
  PropertyType,
  Purpose,
} from 'src/DB/enums/lead.enum';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(LeadSource)
  @IsOptional()
  source?: LeadSource;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  // --- التفضيلات (Preferences) ---
  @IsNumber()
  @IsOptional()
  budgetMin?: number;

  @IsNumber()
  @IsOptional()
  budgetMax?: number;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsNumber()
  @IsOptional()
  bedroomsNeeded?: number;

  @IsString()
  @IsOptional()
  preferredArea?: string;

  @IsEnum(Purpose)
  @IsOptional()
  purpose?: Purpose;

  @IsMongoId()
  @IsOptional()
  assignedAgent?: Types.ObjectId; // الموظف المسؤول (الوسيط)
}
