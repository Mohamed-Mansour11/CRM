import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SubscriptionPlan } from '../enums/company.enum';
import type { Image } from 'src/common/types/image.type';

@Schema({ timestamps: true })
export class Company {
  @Prop({ type: String, required: true, unique: true })
  name!: string;

  @Prop({
    type: String,
    enum: SubscriptionPlan,
    default: SubscriptionPlan.starter,
  })
  subscriptionPlan!: SubscriptionPlan;

  @Prop({ type: Number, default: 5 }) // الحد الأقصى للمستخدمين بناءً على الخطة
  maxUsers!: number;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean; // لإيقاف حساب الشركة في حال عدم الدفع

  @Prop({ type: { secure_url: String, public_id: String }, required: false })
  logo?: Image;

  @Prop({ type: String })
  cloudFolder?: string; // لتنظيم ملفات هذه الشركة على Cloudinary لاحقاً
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export const CompanyModelName = Company.name;

export const CompanyModel = MongooseModule.forFeature([
  { name: CompanyModelName, schema: CompanySchema },
]);

export type CompanyDocument = HydratedDocument<Company>;
