import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';

@Schema({ timestamps: true })
export class Branch {
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId; // 🚀 مفتاح الربط بالشركة

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  location!: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
export const BranchModelName = Branch.name;

export const BranchModel = MongooseModule.forFeature([
  { name: BranchModelName, schema: BranchSchema },
]);

export type BranchDocument = HydratedDocument<Branch>;
