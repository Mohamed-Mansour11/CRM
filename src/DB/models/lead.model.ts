import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'leads' })
export class Lead extends Document {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  phone!: string;

  @Prop({ lowercase: true, trim: true })
  email!: string;

  // 🚀 العزل التام: هذا الحقل يضمن عدم تداخل بيانات الشركات
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, index: true })
  company_id!: Types.ObjectId;

  // الموظف المسؤول عن العميل
  @Prop({ type: Types.ObjectId, ref: 'User' })
  assigned_to!: Types.ObjectId;

  // من قام بإدخال العميل للنظام
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  created_by!: Types.ObjectId;

  @Prop({ type: String, default: 'new' })
  status!: string; // new, contacted, qualified, lost

  // 🚀 الحذف الوهمي لمنع فقدان البيانات المرتبطة بالحسابات
  @Prop({ default: false, index: true })
  isDeleted!: boolean;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// إنشاء Index مركب لتسريع البحث داخل نفس الشركة
LeadSchema.index({ company_id: 1, phone: 1 }, { unique: true });

export const LeadModelName = Lead.name;
