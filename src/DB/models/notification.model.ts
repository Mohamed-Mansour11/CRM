import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { UserModelName } from './user.model';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  user!: Types.ObjectId; // الموظف الموجه له الإشعار

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
  message!: string;

  @Prop({ type: String })
  type?: string; // (e.g., reminder, alert, mention)

  @Prop({ type: Boolean, default: false })
  isRead!: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export const NotificationModelName = Notification.name;
export const NotificationModel = MongooseModule.forFeature([
  { name: NotificationModelName, schema: NotificationSchema },
]);
export type NotificationDocument = HydratedDocument<Notification>;
