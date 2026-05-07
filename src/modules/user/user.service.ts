import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { CompanyRepository } from 'src/DB/repositories/company.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Role } from 'src/DB/enums/user.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly _UserRepository: UserRepository,
    private readonly _CompanyRepository: CompanyRepository,
  ) {}

  // 1. إضافة موظف جديد (مع التحقق من حدود الباقة)
  async createEmployee(
    data: CreateEmployeeDto,
    companyId: Types.ObjectId,
    currentUserId: Types.ObjectId,
  ) {
    // أ. التأكد من أن الإيميل غير مستخدم في النظام كله (الإيميل فريد)
    const emailExists = await this._UserRepository.findOne({
      filter: { email: data.email },
    });
    if (emailExists)
      throw new BadRequestException('Email is already registered!');

    // ب. حماية الـ SaaS: التحقق من حدود المستخدمين للشركة (Max Users)
    const company = await this._CompanyRepository.findOne({
      filter: { _id: companyId },
    });
    if (!company) throw new NotFoundException('Company not found!');

    // عد الموظفين الحاليين في الشركة
    const currentUsersCount = await this._UserRepository.model.countDocuments({
      company_id: companyId,
    });

    if (currentUsersCount >= company.maxUsers) {
      throw new ForbiddenException(
        `User limit reached! Your current plan allows a maximum of ${company.maxUsers} users. Please upgrade your subscription.`,
      );
    }

    // ج. حماية الصلاحيات (لا يمكن لمدير أن يضيف Super Admin أو مدير شركة آخر)
    if (data.role === Role.super_admin || data.role === Role.company_admin) {
      throw new ForbiddenException(
        'You cannot create users with administrative roles.',
      );
    }

    // د. إنشاء الموظف وربطه بالشركة
    const newEmployee = await this._UserRepository.create({
      ...data,
      company_id: companyId, // 🚀 تأمين العزل
    });

    // إخفاء الباسورد قبل إرجاع الرد
    newEmployee.password = undefined as any;

    return { message: 'Employee added successfully', data: newEmployee };
  }

  // 2. جلب قائمة فريق العمل
  async getTeam(companyId: Types.ObjectId) {
    const team = await this._UserRepository.findAll({
      companyId, // 🚀 تأمين العزل
      filter: { role: { $ne: Role.super_admin } }, // لا نعرض السوبر أدمن
      select: '-password', // استبعاد الباسوردات من النتيجة
      populate: { path: 'branch_id', select: 'name' },
    });
    return team;
  }

  // 🚀 3. دالة جديدة لجلب موظفي المبيعات لتعيين العملاء إليهم
  async getSalesAgents(companyId: Types.ObjectId) {
    const agents = await this._UserRepository.findAll({
      companyId,
      filter: {
        // نستخدم $in لجلب أي مستخدم يعمل في قسم المبيعات لتعيين الليد له
        role: { $in: [Role.sales_agent, Role.agent, Role.sales_manager] },
        isActive: true, // لضمان عدم تعيين عميل لموظف حسابه متوقف
      },
      select: 'fullName _id role', // أضفنا role لنتمكن من عرض المسمى الوظيفي تحت اسمه في الواجهة كما في صورتك (مثلاً: Agent أو Senior Agent)
    });
    return agents;
  }

  // 4. إيقاف موظف (Deactivate) بدلاً من حذفه (للحفاظ على تاريخ الصفقات الخاصة به)
  async toggleEmployeeStatus(
    employeeId: Types.ObjectId,
    companyId: Types.ObjectId,
    isActive: boolean,
  ) {
    const employee = await this._UserRepository.update({
      companyId,
      filter: { _id: employeeId, role: { $ne: Role.company_admin } }, // لا يمكن إيقاف مدير الشركة نفسه
      update: { isActive },
      select: '-password',
    });

    if (!employee)
      throw new NotFoundException('Employee not found or cannot be modified.');

    return {
      message: `Employee account ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: employee,
    };
  }
}
