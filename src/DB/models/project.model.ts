import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CompanyModelName } from './company.model';

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: Types.ObjectId, ref: CompanyModelName, required: true })
  company_id!: Types.ObjectId;

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String }) // اسم المطور العقاري (مثل: إعمار، طلعت مصطفى)
  developerName?: string;

  @Prop({ type: String, required: true })
  location!: string;

  @Prop({ type: Number })
  totalUnits?: number; // إجمالي الوحدات في المشروع
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const ProjectModelName = Project.name;
export const ProjectModel = MongooseModule.forFeature([
  { name: ProjectModelName, schema: ProjectSchema },
]);
export type ProjectDocument = HydratedDocument<Project>;
