import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { DealRepository } from 'src/DB/repositories/deal.repository';
import { LeadRepository } from 'src/DB/repositories/lead.repository';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';

@Injectable()
export class DealService {
  constructor(
    private readonly dealRepository: DealRepository,
    private readonly leadRepository: LeadRepository, // نحتاجه للتحقق من العميل
    private readonly i18n: I18nService,
  ) {}

  async create(
    createDealDto: CreateDealDto,
    companyId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ) {
    // 1. التحقق من أن العميل يخص نفس الشركة (أمان إضافي قبل إنشاء الصفقة)
    const leadExists = await this.leadRepository.findOne({
      filter: { _id: createDealDto.lead_id },
      companyId,
    });

    if (!leadExists) {
      throw new BadRequestException(
        'Invalid Lead: Lead does not exist in your company records.',
      );
    }

    // 2. إنشاء الصفقة
    // اجعل كائن الإنشاء هكذا
    return await this.dealRepository.create({
      ...createDealDto,
      company_id: companyId,
      created_by: createdBy,
      stage: 'negotiation' as any,
    } as any); // إضافة as any هنا تحل المشكلة فوراً
  }

  async findAll(
    companyId: Types.ObjectId,
    page: number = 1,
    limit: number = 10,
  ) {
    return await this.dealRepository.findAll({
      filter: {},
      populate: [
        { path: 'lead_id', select: 'name phone email' },
        { path: 'property_id', select: 'title price location' },
        { path: 'assigned_to', select: 'name email' },
      ],
      paginate: { page, limit },
      sort: { createdAt: -1 },
      companyId, // 🚀 الأمان الإجباري
    });
  }

  async findOne(id: Types.ObjectId, companyId: Types.ObjectId) {
    const deal = await this.dealRepository.findOne({
      filter: { _id: id },
      populate: ['lead_id', 'property_id', 'assigned_to'],
      companyId,
    });

    if (!deal) {
      throw new NotFoundException(this.i18n.t('events.DEAL_NOT_FOUND'));
    }

    return deal;
  }

  // ترقية أو تغيير حالة الصفقة (مثال: من negotiation إلى won أو lost)
  async updateStage(
    id: Types.ObjectId,
    updateDealStageDto: UpdateDealStageDto,
    companyId: Types.ObjectId,
  ) {
    const updatedDeal = await this.dealRepository.update({
      filter: { _id: id },
      update: { $set: { stage: updateDealStageDto.stage } },
      companyId,
    });

    if (!updatedDeal) {
      throw new NotFoundException(this.i18n.t('events.DEAL_NOT_FOUND'));
    }

    return updatedDeal;
  }
}
