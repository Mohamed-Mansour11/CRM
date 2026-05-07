import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Types } from 'mongoose';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { FindPropertiesDto } from './dto/find-properties.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @Roles(Role.company_admin, Role.manager, Role.agent, Role.data_entry)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'media', maxCount: 10 }, // بحد أقصى 10 صور للعقار
      { name: 'floorPlan', maxCount: 1 }, // مخطط هندسي واحد
    ]),
  )
  async create(
    @Body() data: CreatePropertyDto,
    @UploadedFiles()
    files: { media?: Express.Multer.File[]; floorPlan?: Express.Multer.File[] },
    @User('company_id') companyId: Types.ObjectId,
    @User('sub') userId: Types.ObjectId,
  ) {
    // التأكد من أن files ليس undefined لتجنب أخطاء Multer
    const safeFiles = files || { media: [], floorPlan: [] };
    return this.propertyService.create(data, companyId, userId);
  }

  @Get()
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async findAll(
    @User('company_id') companyId: Types.ObjectId,
    @Query() query: FindPropertiesDto,
  ) {
    return this.propertyService.findAll(companyId, query.page, query.limit);
  }

  @Get(':id')
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async findOne(
    @Param('id', ParseObjectIdPipe) propertyId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.propertyService.findOne(propertyId, companyId);
  }
}
