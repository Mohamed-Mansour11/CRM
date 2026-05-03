import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async create(@Body() createLeadDto: CreateLeadDto, @User() user: JwtPayload) {
    return await this.leadService.create(
      createLeadDto,
      user.company_id,
      user.sub,
    );
  }

  @Get()
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async findAll(
    @User() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    // الواجهة ستستقبل البيانات مقسمة (Pagination) تلقائياً
    return await this.leadService.findAll(user.company_id, page, limit);
  }

  @Get(':id')
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async findOne(@Param('id') id: Types.ObjectId, @User() user: JwtPayload) {
    return await this.leadService.findOne(id, user.company_id);
  }

  @Patch(':id')
  @Roles(Role.company_admin, Role.sales_manager)
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateLeadDto: UpdateLeadDto,
    @User() user: JwtPayload,
  ) {
    return await this.leadService.update(id, updateLeadDto, user.company_id);
  }

  @Delete(':id')
  @Roles(Role.company_admin) // صلاحية الحذف للمدراء فقط
  async remove(@Param('id') id: Types.ObjectId, @User() user: JwtPayload) {
    return await this.leadService.softDelete(id, user.company_id);
  }
}
