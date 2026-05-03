import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisitOutcome, VisitStatus } from 'src/DB/enums/visit.enum';

export class UpdateVisitOutcomeDto {
  @IsEnum(VisitStatus)
  @IsNotEmpty()
  status!: VisitStatus; // عادة ستكون completed أو no_show

  @IsEnum(VisitOutcome)
  @IsOptional()
  outcome?: VisitOutcome; // مهتم، غير مهتم، الخ

  @IsString()
  @IsOptional()
  agentNotes?: string; // تقرير الوسيط
}
