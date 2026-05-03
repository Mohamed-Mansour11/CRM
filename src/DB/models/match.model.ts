import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { LeadModelName } from './lead.model';
import { PropertyModelName } from './property.model';

export enum MatchType {
  auto = 'auto',
  manual = 'manual',
}
export enum MatchStatus {
  suggested = 'suggested',
  shortlisted = 'shortlisted',
  interested = 'interested',
  rejected = 'rejected',
  visit_scheduled = 'visit_scheduled',
}

@Schema({ timestamps: true })
export class Match {
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LeadModelName, required: true })
  lead!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PropertyModelName, required: true })
  property!: Types.ObjectId;

  @Prop({ type: Number, min: 0, max: 100 })
  score?: number; // نسبة التوافق (AI Compatibility Score)

  @Prop({ type: String, enum: MatchType, default: MatchType.manual })
  matchType!: MatchType;

  @Prop({ type: String, enum: MatchStatus, default: MatchStatus.suggested })
  status!: MatchStatus;

  @Prop({ type: String })
  clientFeedback?: string; // تعليق العميل على العقار
}

export const MatchSchema = SchemaFactory.createForClass(Match);
export const MatchModelName = Match.name;
export const MatchModel = MongooseModule.forFeature([
  { name: MatchModelName, schema: MatchSchema },
]);
export type MatchDocument = HydratedDocument<Match>;
