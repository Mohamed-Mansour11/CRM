import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DealStage } from 'src/DB/enums/deal.enum';

export class UpdateDealStageDto {
  @IsEnum(DealStage)
  @IsNotEmpty()
  stage!: DealStage;

  @IsString()
  @IsOptional()
  lostReason?: string; // مطلوب إذا كانت الحالة closed_lost
}
