import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsPositive,
} from 'class-validator';
import { Types } from 'mongoose';
import { LeadSource, LeadStatus } from 'src/DB/enums/lead.enum';
import { Type } from 'class-transformer';

export class FindLeadsDto {
  @IsOptional()
  @IsString()
  k?: string; // كلمة البحث (الاسم أو رقم الهاتف)

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsMongoId()
  assignedAgent?: Types.ObjectId; // لفلترة عملاء موظف معين

  @IsOptional()
  @IsInt()
  @Min(1)
  @IsPositive()
  @Type(() => Number)
  page?: number;
}
