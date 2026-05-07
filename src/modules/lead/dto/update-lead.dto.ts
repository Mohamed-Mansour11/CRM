import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsString()
  @IsOptional()
  @IsIn(['new', 'contacted', 'qualified', 'lost'], {
    message: 'Status must be one of: new, contacted, qualified, lost',
  })
  status?: string;
  @IsString()
  @IsOptional()
  lostReason?: string; //سبب خسارة العميل
}
