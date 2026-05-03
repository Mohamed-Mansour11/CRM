import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../enums/user.enum';
import { hash } from 'src/common/utils/hash.util';
import { CompanyModelName } from './company.model';
import { BranchModelName } from './branch.model';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  fullName!: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ type: String, required: true })
  phone!: string;

  @Prop({ type: String, required: true, select: false })
  password!: string;

  @Prop({ type: String, enum: Role, required: true })
  role!: Role;

  // 🚀 مفتاح الربط بالشركة (غير مطلوب للـ super_admin)
  @Prop({ type: Types.ObjectId, ref: CompanyModelName })
  company_id?: Types.ObjectId;

  // مفتاح الربط بالفرع (لتقسيم فرق المبيعات)
  @Prop({ type: Types.ObjectId, ref: BranchModelName })
  branch_id?: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  @Prop()
  passwordResetToken!: string;

  @Prop()
  passwordResetExpires!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hook لعمل Hashing للباسورد
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
});

export const UserModelName = User.name;

export const UserModel = MongooseModule.forFeature([
  { name: UserModelName, schema: UserSchema },
]);

export type UserDocument = HydratedDocument<User>;
