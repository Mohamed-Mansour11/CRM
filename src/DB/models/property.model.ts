import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';
import { UserModelName } from './user.model';
import { PropertyType, Purpose } from '../enums/lead.enum';
import { PropertyStatus } from '../enums/property.enum';
import type { Image } from 'src/common/types/image.type';

@Schema({ timestamps: true })
export class Property {
  // 🚀 مفتاح العزل الأساسي
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, enum: PropertyType, required: true })
  type!: PropertyType;

  @Prop({ type: String, enum: Purpose, required: true })
  purpose!: Purpose;

  @Prop({
    type: String,
    enum: PropertyStatus,
    default: PropertyStatus.available,
  })
  status!: PropertyStatus;

  // يمكن أن يكون العقار جزءاً من مشروع/كمبوند (اختياري)
  // @Prop({ type: Types.ObjectId, ref: 'Project' })
  // projectId?: Types.ObjectId;

  @Prop({ type: Number, required: true })
  price!: number;

  @Prop({ type: Number, required: true })
  areaSqm!: number;

  @Prop({ type: Number })
  bedrooms?: number;

  @Prop({ type: Number })
  bathrooms?: number;

  @Prop({ type: Number })
  floor?: number;

  @Prop({ type: [String], default: [] })
  amenities!: string[];

  // --- الموقع (Location) ---
  @Prop({ type: String, required: true })
  locationCity!: string;

  @Prop({ type: String })
  locationDistrict?: string;

  @Prop({ type: Number })
  latitude?: number;

  @Prop({ type: Number })
  longitude?: number;

  // --- الميديا ---
  @Prop({ type: [{ secure_url: String, public_id: String }], default: [] })
  media!: Image[];

  @Prop({ type: { secure_url: String, public_id: String } })
  floorPlan?: Image;

  @Prop({ type: String })
  description?: string;

  // --- الروابط (Relations) ---
  @Prop({ type: Types.ObjectId, ref: UserModelName, required: true })
  listedByAgent!: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);

export const PropertyModelName = Property.name;
export const PropertyModel = MongooseModule.forFeature([
  { name: PropertyModelName, schema: PropertySchema },
]);
export type PropertyDocument = HydratedDocument<Property>;
