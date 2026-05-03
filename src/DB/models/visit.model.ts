import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { LeadModelName } from './lead.model';
import { PropertyModelName } from './property.model';
import { UserModelName } from './user.model';
import { VisitOutcome, VisitStatus } from '../enums/visit.enum';

@Schema({ timestamps: true })
export class Visit {
  // 🚀 حماية الـ SaaS
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LeadModelName, required: true })
  lead!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PropertyModelName, required: true })
  property!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  agent!: Types.ObjectId; // الوسيط العقاري المسؤول عن الزيارة

  @Prop({ type: Date, required: true })
  scheduledAt!: Date; // موعد الزيارة

  @Prop({ type: String, enum: VisitStatus, default: VisitStatus.scheduled })
  status!: VisitStatus;

  @Prop({ type: String, enum: VisitOutcome })
  outcome?: VisitOutcome; // نتيجة الزيارة (تُملأ بعد الانتهاء)

  @Prop({ type: String })
  agentNotes?: string; // ملاحظات الوسيط بعد الزيارة
}

export const VisitSchema = SchemaFactory.createForClass(Visit);

export const VisitModelName = Visit.name;
export const VisitModel = MongooseModule.forFeature([
  { name: VisitModelName, schema: VisitSchema },
]);
export type VisitDocument = HydratedDocument<Visit>;
