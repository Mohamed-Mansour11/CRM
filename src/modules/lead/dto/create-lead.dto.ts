import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
// افترض أننا أضفنا هذه الـ Enums الجديدة في ملف lead.enum.ts
import {
  LeadSource,
  PropertyType,
  MoveInTimeframe,
  UrgencyLevel,
} from 'src/DB/enums/lead.enum';

export class CreateLeadDto {
  // --- Step 1: Contact Info ---
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsEmail()
  @IsOptional()
  emailAddress?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsEnum(LeadSource)
  @IsOptional()
  leadSource?: LeadSource;

  // --- Step 2: Preferences ---
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType?: PropertyType;

  @IsString()
  @IsOptional()
  preferredLocation?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bathrooms?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mustHaveAmenities?: string[];

  // --- Step 3: Budget ---
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minBudget?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxBudget?: number;

  @IsEnum(MoveInTimeframe)
  @IsOptional()
  moveInTimeframe?: MoveInTimeframe;

  @IsEnum(UrgencyLevel)
  @IsOptional()
  urgencyLevel?: UrgencyLevel;

  @IsString()
  @IsOptional()
  additionalNotes?: string;

  // --- Step 4: Assignment ---
  @IsMongoId()
  @IsOptional()
  assignedAgent?: Types.ObjectId;
}
