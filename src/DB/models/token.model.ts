import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'tokens' })
export class Token extends Document {
  // ربط التوكن بالمستخدم
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user_id!: Types.ObjectId;

  // التوكن نفسه (سواء كان JWT أو نص عشوائي مشفر)
  @Prop({ required: true, unique: true })
  token!: string;

  // نوع التوكن لمعرفة الغرض منه
  @Prop({ required: true, enum: ['refresh', 'reset_password', 'verify_email'] })
  type!: string;

  // 🚀 تاريخ الانتهاء (سيتم استخدامه لحذف المستند تلقائياً)
  @Prop({ required: true })
  expiresAt!: Date;

  // إمكانية حظر التوكن قبل انتهاء صلاحيته (لحالات تسجيل الخروج الإجباري أو الاختراق)
  @Prop({ default: false })
  isBlacklisted!: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

// 🚀 TTL Index: إجبار MongoDB على حذف السطر بالكامل تلقائياً عند وصول وقت expiresAt
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
