import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

// يفضل نقل هذا الـ Enum لاحقاً إلى مجلد src/DB/enums/visit.enum.ts
export enum VisitOutcome {
  INTERESTED = 'interested',
  NOT_INTERESTED = 'not_interested',
  POSTPONED = 'postponed',
  OFFER_MADE = 'offer_made',
}

export class UpdateVisitOutcomeDto {
  @IsNotEmpty()
  @IsEnum(VisitOutcome, {
    message:
      'Outcome must be one of: interested, not_interested, postponed, offer_made',
  })
  outcome!: VisitOutcome;

  @IsOptional()
  @IsString()
  notes?: string;
}
