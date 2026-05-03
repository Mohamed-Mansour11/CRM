import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { DealModelName } from './deal.model';
import type { Image } from 'src/common/types/image.type';

export enum PaymentType {
  down_payment = 'down_payment',
  installment = 'installment',
  final_payment = 'final_payment',
  maintenance = 'maintenance',
}
export enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  overdue = 'overdue',
  waived = 'waived',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DealModelName, required: true })
  deal!: Types.ObjectId;

  @Prop({ type: Number })
  installmentNumber?: number; // رقم القسط (مثلاً: 1 من 12)

  @Prop({ type: String, enum: PaymentType, required: true })
  type!: PaymentType;

  @Prop({ type: Number, required: true })
  amount!: number;

  @Prop({ type: Date, required: true })
  dueDate!: Date; // تاريخ الاستحقاق

  @Prop({ type: Date })
  paidDate?: Date; // تاريخ الدفع الفعلي

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.pending })
  status!: PaymentStatus;

  @Prop({ type: { secure_url: String, public_id: String } })
  receiptDoc?: Image; // صورة إيصال الدفع

  @Prop({ type: String })
  notes?: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
export const PaymentModelName = Payment.name;
export const PaymentModel = MongooseModule.forFeature([
  { name: PaymentModelName, schema: PaymentSchema },
]);
export type PaymentDocument = HydratedDocument<Payment>;
