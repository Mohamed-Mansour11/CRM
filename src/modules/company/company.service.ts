import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CompanyRepository } from 'src/DB/repositories/company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly i18n: I18nService,
  ) {}

  // 🚀 هذه الدالة تُستدعى بواسطة Super Admin فقط لإنشاء مستأجر (Tenant) جديد
  async create(createCompanyDto: CreateCompanyDto) {
    return await this.companyRepository.create({
      ...createCompanyDto,
      isActive: true,
    });
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

  // تحديث إعدادات الشركة (مثل الشعار، الاسم، إلخ)
  async updateCompanyProfile(companyId: Types.ObjectId, updateData: any) {
    const updatedCompany = await this.companyRepository.update({
      filter: { _id: companyId },
      update: { $set: updateData },
      // هنا لا نمرر companyId كمتغير أمان إضافي لأن الفلتر نفسه هو الـ companyId
    });

    if (!updatedCompany) {
      throw new NotFoundException('Company not found');
    }

    return updatedCompany;
  }
}
