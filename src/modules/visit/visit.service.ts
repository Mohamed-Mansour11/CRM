import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { VisitRepository } from 'src/DB/repositories/visit.repository';
import { LeadRepository } from 'src/DB/repositories/lead.repository';
import { PropertyRepository } from 'src/DB/repositories/property.repository';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitOutcomeDto } from './dto/update-visit-outcome.dto';
import { VisitStatus } from 'src/DB/enums/visit.enum';

@Injectable()
export class VisitService {
  constructor(
    private readonly _VisitRepository: VisitRepository,
    private readonly _LeadRepository: LeadRepository,
    private readonly _PropertyRepository: PropertyRepository,
  ) {}

  async create(
    data: CreateVisitDto,
    companyId: Types.ObjectId,
    currentUserId: Types.ObjectId,
  ) {
    // 1. التأكد من أن العميل والعقار تابعان للشركة
    const lead = await this._LeadRepository.findOne({
      filter: { _id: data.lead },
      companyId,
    });
    const property = await this._PropertyRepository.findOne({
      filter: { _id: data.property },
      companyId,
    });

    if (!lead || !property) {
      throw new NotFoundException(
        'Lead or Property not found in your company.',
      );
    }

    // 2. التحقق من تاريخ الزيارة
    if (new Date(data.scheduledAt) < new Date()) {
      throw new BadRequestException('Cannot schedule a visit in the past.');
    }

    // 3. تحديد الوسيط (Agent): إما الممرر في ה-DTO أو المستخدم الحالي
    const agentId = data.agent || currentUserId;

    // (اختياري) يمكنك إضافة كود هنا للتحقق من عدم وجود زيارة أخرى للوسيط في نفس الوقت

    const visit = await this._VisitRepository.create({
      ...data,
      company_id: companyId, // 🚀 تأمين SaaS
      agent: agentId as any,
      status: data.status || VisitStatus.scheduled,
    });

    return { message: 'Visit scheduled successfully', data: visit };
  }

  // جلب زيارات الشركة (أو زيارات موظف محدد) مع فلترة بالوقت
  async findAll(
    companyId: Types.ObjectId,
    agentId?: Types.ObjectId,
    status?: VisitStatus,
    date?: Date,
  ) {
    const filterQuery: any = {};
    if (agentId) filterQuery.agent = agentId;
    if (status) filterQuery.status = status;

    // فلترة بناءً على يوم محدد (بداية ونهاية اليوم)
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filterQuery.scheduledAt = { $gte: startDate, $lte: endDate };
    }

    const visits = await this._VisitRepository.findAll({
      companyId, // 🚀 تأمين SaaS
      filter: filterQuery,
      populate: [
        { path: 'lead', select: 'fullName phone' },
        { path: 'property', select: 'title locationCity' },
        { path: 'agent', select: 'fullName' },
      ],
      sort: { scheduledAt: 1 }, // ترتيب تصاعدي (الأقرب أولاً)
      paginate: { page: 1, limit: 50 }, // عادة ما يُعرض جدول الزيارات كقائمة
    });

    return visits;
  }

  async updateOutcome(
    visitId: Types.ObjectId,
    data: UpdateVisitOutcomeDto,
    companyId: Types.ObjectId,
  ) {
    const visit = await this._VisitRepository.update({
      companyId, // 🚀 تأمين SaaS
      filter: { _id: visitId },
      update: { ...data },
    });

    if (!visit) throw new NotFoundException('Visit not found');

    return { message: 'Visit outcome recorded successfully', data: visit };
  }

  async remove(visitId: Types.ObjectId, companyId: Types.ObjectId) {
    const visit = await this._VisitRepository.delete(
      { _id: visitId },
      undefined,
      companyId,
    );
    if (!visit) throw new NotFoundException('Visit not found');
    return { message: 'Visit cancelled and removed' };
  }
}
