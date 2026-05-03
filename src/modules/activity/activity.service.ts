import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ActivityRepository } from 'src/DB/repositories/activity.repository';
import { EntityType } from 'src/DB/models/activity.model';

@Injectable()
export class ActivityService {
  constructor(private readonly _ActivityRepository: ActivityRepository) {}

  // 1. دالة التسجيل (تُستدعى داخلياً من الـ Services الأخرى ولا ترتبط بـ Controller)
  async logActivity(
    companyId: Types.ObjectId,
    userId: Types.ObjectId,
    entityType: EntityType,
    entityId: Types.ObjectId,
    action: string,
    notes?: string,
  ) {
    // نقوم بتشغيلها في الخلفية (Fire and Forget) حتى لا تبطئ استجابة النظام
    this._ActivityRepository
      .create({
        company_id: companyId,
        user: userId,
        entityType,
        entityId,
        action,
        notes,
      })
      .catch((err) => console.error('Failed to log activity:', err));
  }

  // 2. دالة استعراض السجل (للوحة تحكم المدير)
  async getCompanyActivities(
    companyId: Types.ObjectId,
    page: number = 1,
    entityId?: Types.ObjectId,
  ) {
    const filter: any = {};
    if (entityId) filter.entityId = entityId; // لفلترة حركات عميل معين أو صفقة معينة

    const activities = await this._ActivityRepository.findAll({
      companyId, // 🚀 تأمين العزل (SaaS)
      filter,
      populate: { path: 'user', select: 'fullName role' },
      sort: { createdAt: -1 }, // الأحدث أولاً
      paginate: { page, limit: 20 },
    });

    return activities;
  }
}
