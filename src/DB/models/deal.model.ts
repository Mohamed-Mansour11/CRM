import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { LeadModelName } from './lead.model';
import { PropertyModelName } from './property.model';
import { UserModelName } from './user.model';
import { DealStage } from '../enums/deal.enum';
import type { Image } from 'src/common/types/image.type';

@Schema({ timestamps: true })
export class Deal {
  //  حماية الـ SaaS
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: LeadModelName, required: true })
  lead!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PropertyModelName, required: true })
  property!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  agent!: Types.ObjectId; // الوسيط الذي أغلق الصفقة

  @Prop({ type: Types.ObjectId, ref: UserModelName })
  manager?: Types.ObjectId; // المدير الذي وافق على الصفقة

  @Prop({ type: String, enum: DealStage, default: DealStage.offer })
  stage!: DealStage;

  @Prop({ type: Number, required: true })
  askingPrice!: number; // السعر الأصلي للعقار

  @Prop({ type: Number })
  agreedPrice?: number; // السعر النهائي بعد التفاوض

  @Prop({ type: Number })
  commissionRate?: number; // نسبة العمولة (مثلاً 2.5%)

  @Prop({ type: Number })
  commissionAmount?: number; // قيمة العمولة النقدية (تُحسب تلقائياً)

  // نستخدم نفس النوع (Image) الذي بنيته لرفع ملف العقد (PDF أو صورة) على Cloudinary
  @Prop({ type: { secure_url: String, public_id: String } })
  contractDoc?: Image;

  @Prop({ type: Date })
  expectedCloseDate?: Date;

  @Prop({ type: Date })
  actualCloseDate?: Date; // تاريخ إغلاق الصفقة الفعلي

  @Prop({ type: String })
  lostReason?: string;
}

export const DealSchema = SchemaFactory.createForClass(Deal);

// 🔥 Hook ذكي لحساب قيمة العمولة تلقائياً قبل الحفظ
DealSchema.pre('save', function () {
  if (this.agreedPrice && this.commissionRate) {
    this.commissionAmount = (this.agreedPrice * this.commissionRate) / 100;
  }
});

export const DealModelName = Deal.name;
export const DealModel = MongooseModule.forFeature([
  { name: DealModelName, schema: DealSchema },
]);
export type DealDocument = HydratedDocument<Deal>;
