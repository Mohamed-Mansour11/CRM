import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { PropertyRepository } from 'src/DB/repositories/property.repository';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    private readonly propertyRepository: PropertyRepository,
    private readonly i18n: I18nService,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    companyId: Types.ObjectId,
    userId: Types.ObjectId, // نستقبل الـ userId من الكنترولر
  ) {
    return await this.propertyRepository.create({
      ...createPropertyDto,
      company_id: companyId,
      listedByAgent: userId, // 🚀 التعديل السحري: غيرنا الاسم ليتطابق مع الداتا بيز
    });
  }

  async findAll(
    companyId: Types.ObjectId,
    page: number = 1,
    limit: number = 10,
  ) {
    return await this.propertyRepository.findAll({
      filter: { isDeleted: { $ne: true } },
      paginate: { page, limit },
      sort: { createdAt: -1 },
      companyId, // 🚀 الأمان الإجباري: حقن معرف الشركة
    });
  }

  async findOne(id: Types.ObjectId, companyId: Types.ObjectId) {
    const property = await this.propertyRepository.findOne({
      filter: { _id: id, isDeleted: false },
      companyId,
    });

    if (!property) {
      throw new NotFoundException(this.i18n.t('events.PROPERTY_NOT_FOUND'));
    }

    return property;
  }

  async update(
    id: Types.ObjectId,
    updatePropertyDto: UpdatePropertyDto,
    companyId: Types.ObjectId,
  ) {
    const updatedProperty = await this.propertyRepository.update({
      filter: { _id: id, isDeleted: false },
      update: { $set: updatePropertyDto },
      companyId,
    });

    if (!updatedProperty) {
      throw new NotFoundException(this.i18n.t('events.PROPERTY_NOT_FOUND'));
    }
    return updatedProperty;
  }

  async softDelete(id: Types.ObjectId, companyId: Types.ObjectId) {
    const deletedProperty = await this.propertyRepository.update({
      filter: { _id: id },
      update: { $set: { isDeleted: true } },
      companyId,
    });

    if (!deletedProperty) {
      throw new NotFoundException(this.i18n.t('events.PROPERTY_NOT_FOUND'));
    }
    return { message: 'Property deleted successfully' };
  }
}
