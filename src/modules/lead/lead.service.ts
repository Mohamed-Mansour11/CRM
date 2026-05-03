import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead } from 'src/DB/models/lead.model';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<Lead>,
    private readonly i18n: I18nService, // حقن خدمة الترجمة
  ) {}

  async create(
    createLeadDto: CreateLeadDto,
    companyId: Types.ObjectId,
    createdBy: Types.ObjectId,
  ) {
    const newLead = new this.leadModel({
      ...createLeadDto,
      company_id: companyId,
      created_by: createdBy,
    });
    return await newLead.save();
  }

  async findAll(
    companyId: Types.ObjectId,
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.leadModel
        .find({ company_id: companyId, isDeleted: false }) // عزل البيانات والـ Soft Delete
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('assigned_to', 'name email')
        .exec(),
      this.leadModel.countDocuments({
        company_id: companyId,
        isDeleted: false,
      }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: Types.ObjectId, companyId: Types.ObjectId) {
    const lead = await this.leadModel
      .findOne({
        _id: id,
        company_id: companyId,
        isDeleted: false,
      })
      .populate('assigned_to', 'name email');

    if (!lead) {
      // استخدام الترجمة لرسائل الخطأ
      throw new NotFoundException(this.i18n.t('events.LEAD_NOT_FOUND'));
    }

    return lead;
  }

  async update(
    id: Types.ObjectId,
    updateLeadDto: UpdateLeadDto,
    companyId: Types.ObjectId,
  ) {
    const updatedLead = await this.leadModel.findOneAndUpdate(
      { _id: id, company_id: companyId, isDeleted: false },
      { $set: updateLeadDto },
      { new: true },
    );

    if (!updatedLead) {
      throw new NotFoundException(this.i18n.t('events.LEAD_NOT_FOUND'));
    }
    return updatedLead;
  }

  async softDelete(id: Types.ObjectId, companyId: Types.ObjectId) {
    const deletedLead = await this.leadModel.findOneAndUpdate(
      { _id: id, company_id: companyId },
      { $set: { isDeleted: true } },
    );

    if (!deletedLead) {
      throw new NotFoundException(this.i18n.t('events.LEAD_NOT_FOUND'));
    }
    return { message: 'Lead deleted successfully' };
  }
}
