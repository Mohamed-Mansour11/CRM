import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { Role } from 'src/DB/enums/user.enum';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role; // (مثلاً: agent, manager, data_entry)

  @IsMongoId()
  @IsOptional()
  branch_id?: Types.ObjectId; // ربط الموظف بفرع معين (اختياري)
}
