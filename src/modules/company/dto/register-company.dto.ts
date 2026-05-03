import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { SubscriptionPlan } from 'src/DB/enums/company.enum';

export class RegisterCompanyDto {
  // بيانات الشركة
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEnum(SubscriptionPlan)
  plan!: SubscriptionPlan;

  // بيانات المدير (Company Admin)
  @IsString()
  @IsNotEmpty()
  adminFullName!: string;

  @IsEmail()
  @IsNotEmpty()
  adminEmail!: string;

  @IsString()
  @IsNotEmpty()
  adminPhone!: string;

  @IsString()
  @MinLength(6)
  adminPassword!: string;
}
