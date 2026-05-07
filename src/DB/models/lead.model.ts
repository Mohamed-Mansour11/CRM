import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'leads' })
export class Lead extends Document {
  // --- Contact Info ---
  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({ required: true, trim: true })
  phoneNumber!: string;

  @Prop({ lowercase: true, trim: true })
  emailAddress!: string;

  @Prop({ trim: true })
  nationality!: string;

  @Prop({ type: String })
  leadSource!: string;

  // --- Preferences ---
  @Prop({ type: String })
  propertyType!: string;

  @Prop({ trim: true })
  preferredLocation!: string;

  @Prop({ type: Number })
  bedrooms!: number;

  @Prop({ type: Number })
  bathrooms!: number;

  @Prop({ type: [String], default: [] })
  mustHaveAmenities!: string[];

  // --- Budget ---
  @Prop({ type: Number })
  minBudget!: number;

  @Prop({ type: Number })
  maxBudget!: number;

  @Prop({ type: String })
  moveInTimeframe!: string;

  @Prop({ type: String })
  urgencyLevel!: string;

  @Prop({ trim: true })
  additionalNotes!: string;

  // --- System & Tracking Data ---
  // 🚀 العزل التام: هذا الحقل يضمن عدم تداخل بيانات الشركات
  @Prop({ type: Types.ObjectId, ref: 'Company', required: true, index: true })
  company_id!: Types.ObjectId;

  // الموظف المسؤول عن العميل
  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedAgent!: Types.ObjectId;

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

// إنشاء Index مركب لتسريع البحث داخل نفس الشركة (تم تغيير phone إلى phoneNumber)
LeadSchema.index({ company_id: 1, phoneNumber: 1 }, { unique: true });

export const LeadModelName = Lead.name;
