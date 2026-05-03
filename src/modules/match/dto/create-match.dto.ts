import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { MatchStatus, MatchType } from 'src/DB/models/match.model';

export class CreateMatchDto {
  @IsMongoId()
  @IsNotEmpty()
  lead!: Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  property!: Types.ObjectId;

  @IsEnum(MatchType)
  @IsOptional()
  matchType?: MatchType; // auto أو manual
}
