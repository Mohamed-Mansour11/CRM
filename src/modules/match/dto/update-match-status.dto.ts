import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MatchStatus } from 'src/DB/models/match.model';

export class UpdateMatchStatusDto {
  @IsEnum(MatchStatus)
  @IsNotEmpty()
  status!: MatchStatus;

  @IsString()
  @IsOptional()
  clientFeedback?: string; // تعليق العميل (مثلاً: "السعر مرتفع جداً")
}
