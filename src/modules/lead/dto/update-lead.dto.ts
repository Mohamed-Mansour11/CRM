import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsString()
  @IsOptional()
  lostReason?: string; // سبب خسارة العميل (يُسجل إذا تحولت الحالة إلى lost)
}
