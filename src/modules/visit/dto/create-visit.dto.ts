import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { VisitStatus } from 'src/DB/enums/visit.enum';

export class CreateVisitDto {
  @IsMongoId()
  @IsNotEmpty()
  lead!: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  property!: Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  agent?: Types.ObjectId; // لو المدير هو من يجدول الزيارة لأحد موظفيه

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  scheduledAt!: Date;

  @IsEnum(VisitStatus)
  @IsOptional()
  status?: VisitStatus;
}
