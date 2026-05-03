import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { UserModelName } from './user.model';

export enum EntityType {
  lead = 'lead',
  deal = 'deal',
  property = 'property',
  visit = 'visit',
}

@Schema({ timestamps: true })
export class Activity {
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  user!: Types.ObjectId; // الموظف الذي قام بالحدث

  @Prop({ type: String, enum: EntityType, required: true })
  entityType!: EntityType;

  @Prop({ type: Types.ObjectId, required: true })
  entityId!: Types.ObjectId; // الـ ID الخاص بالعميل أو الصفقة أو العقار

  @Prop({ type: String, required: true })
  action!: string; // نوع الحركة (مثال: "قام بتغيير حالة العميل إلى مهتم")

  @Prop({ type: String })
  notes?: string; // تفاصيل إضافية أو محتوى المكالمة
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
export const ActivityModelName = Activity.name;
export const ActivityModel = MongooseModule.forFeature([
  { name: ActivityModelName, schema: ActivitySchema },
]);
export type ActivityDocument = HydratedDocument<Activity>;
