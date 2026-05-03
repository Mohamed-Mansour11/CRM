import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { MatchRepository } from 'src/DB/repositories/match.repository';
import { LeadRepository } from 'src/DB/repositories/lead.repository';
import { PropertyRepository } from 'src/DB/repositories/property.repository';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly leadRepository: LeadRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly i18n: I18nService,
  ) {}

  // 1. خوارزمية المطابقة التلقائية (تُستدعى يدوياً أو عبر Cron Job)
  async generateAutoMatches(companyId: Types.ObjectId) {
    // جلب العملاء الجدد (تخيل أن لديهم حقول budget و desired_location)
    const leadsResult = await this.leadRepository.findAll({
      filter: { status: 'new' },
      companyId, // 🚀 العزل الإجباري للشركة
    });

    // جلب العقارات المتاحة للبيع أو الإيجار
    const propertiesResult = await this.propertyRepository.findAll({
      filter: { status: 'available' as any },
      companyId,
    });

    const leads = leadsResult.data;
    const properties = propertiesResult.data;
    let newMatchesCount = 0;

    for (const lead of leads) {
      for (const property of properties) {
        // منطق المطابقة (مثال: الميزانية تتوافق مع السعر، والموقع المطلوب هو موقع العقار)
        if (
          lead.budget >= property.price &&
          lead.desired_location === property.location
        ) {
          // التأكد من عدم وجود مطابقة سابقة لهذا العميل مع هذا العقار تحديداً
          const existingMatch = await this.matchRepository.findOne({
            filter: { lead_id: lead._id, property_id: property._id },
            companyId,
          });

          if (!existingMatch) {
            // حساب نسبة التوافق (مثال مبسط)
            const matchScore = lead.budget === property.price ? 100 : 85;

            await this.matchRepository.create({
              lead_id: lead._id,
              property_id: property._id,
              company_id: companyId,
              match_score: matchScore,
              status: 'pending',
            } as any); // إضافة as any هنا
            newMatchesCount++;
          }
        }
      }
    }

    return {
      message: `Auto-matching completed. ${newMatchesCount} new matches found.`,
    };
  }

  // 2. جلب المطابقات الخاصة بعميل معين
  async getMatchesForLead(
    leadId: Types.ObjectId,
    companyId: Types.ObjectId,
    page: number = 1,
    limit: number = 10,
  ) {
    return await this.matchRepository.findAll({
      filter: { lead_id: leadId },
      populate: 'property_id', // جلب بيانات العقار كاملة
      paginate: { page, limit },
      sort: { match_score: -1 }, // ترتيب من النسبة الأعلى للأقل
      companyId,
    });
  }

  // 3. تحديث حالة المطابقة (مثال: العميل وافق على العقار أو رفضه)
  async updateMatchStatus(
    matchId: Types.ObjectId,
    updateMatchStatusDto: UpdateMatchStatusDto,
    companyId: Types.ObjectId,
  ) {
    const updatedMatch = await this.matchRepository.update({
      filter: { _id: matchId },
      update: { $set: { status: updateMatchStatusDto.status } },
      companyId,
    });

    if (!updatedMatch) {
      throw new NotFoundException(this.i18n.t('events.MATCH_NOT_FOUND'));
    }

    return updatedMatch;
  }
}
