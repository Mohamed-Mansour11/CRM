import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyRepository } from 'src/DB/repositories/company.repository';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { Role } from 'src/DB/enums/user.enum';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    // 🚀 قمنا بحقن UserRepository لنتمكن من إنشاء حساب المدير
    private readonly userRepository: UserRepository,
  ) {}

  // دالة التسجيل الأساسية (لإنشاء بيئة الشركة بالكامل)
  async create(data: RegisterCompanyDto) {
    // 1. التأكد من أن البريد الإلكتروني للمدير غير مستخدم مسبقاً في النظام
    const existingAdmin = await this.userRepository.findOne({
      filter: { email: data.adminEmail },
    });

    if (existingAdmin) {
      throw new BadRequestException('Admin email is already registered.');
    }

    // 2. إنشاء الشركة (Tenant) وتصحيح ربط الحقول
    const company = await this.companyRepository.create({
      name: data.companyName, // 🚀 هنا قمنا بحل المشكلة: ربط companyName بـ name
      subscriptionPlan: data.plan,
      isActive: true,
    } as any);

    // 3. إنشاء حساب مدير الشركة (Company Admin) وربطه بالشركة الجديدة
    const admin = await this.userRepository.create({
      fullName: data.adminFullName,
      email: data.adminEmail,
      phone: data.adminPhone,
      password: data.adminPassword,
      role: Role.company_admin,
      company_id: company._id as any, // ربط المدير بالـ Tenant الخاص به
    } as any);

    // 4. إخفاء كلمة المرور المشفّرة من الرد كإجراء أمني
    admin.password = undefined as any;

    return {
      message: 'Company and Admin account registered successfully',
      data: {
        company,
        admin,
      },
    };
  }

  // استعراض بيانات الشركة الخاصة بالمستخدم الحالي
  async getMyCompanyProfile(companyId: Types.ObjectId) {
    const company = await this.companyRepository.findOne({
      filter: { _id: companyId, isActive: true },
    });

    if (!company) {
      throw new NotFoundException('Company profile not found or inactive');
    }

    return company;
  }

  // تحديث إعدادات الشركة
  async updateCompanyProfile(companyId: Types.ObjectId, updateData: any) {
    const updatedCompany = await this.companyRepository.update({
      filter: { _id: companyId },
      update: { $set: updateData },
    });

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }
}
