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
import { Types } from 'mongoose';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitOutcomeDto } from './dto/update-visit-outcome.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { VisitStatus } from 'src/DB/enums/visit.enum';

@Controller('visits')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async create(
    @Body() data: CreateVisitDto,
    @User('company_id') companyId: Types.ObjectId,
    @User('_id') currentUserId: Types.ObjectId,
  ) {
    return this.visitService.create(data, companyId, currentUserId);
  }

  @Get()
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async findAll(
    @User('company_id') companyId: Types.ObjectId,
    @Query('agentId') agentId?: Types.ObjectId,
    @Query('status') status?: VisitStatus,
    @Query('date') date?: Date,
  ) {
    // 💡 في النظام الحقيقي: الـ Agent يرى زياراته فقط، بينما الـ Manager يرى زيارات الكل
    // يمكنك إضافة منطق بسيط هنا: إذا كان المستخدم Agent، نفرض أن يكون agentId هو الـ ID الخاص به
    return this.visitService.findAll(companyId, agentId, status, date);
  }

  @Patch(':id/outcome')
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async updateOutcome(
    @Param('id', ParseObjectIdPipe) visitId: Types.ObjectId,
    @Body() updateOutcomeDto: UpdateVisitOutcomeDto,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.visitService.updateOutcome(
      visitId,
      updateOutcomeDto,
      companyId,
    );
  }

  @Delete(':id')
  @Roles(Role.company_admin, Role.manager) // إلغاء الزيارة تماماً يحتاج صلاحية مدير
  async remove(
    @Param('id', ParseObjectIdPipe) visitId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.visitService.remove(visitId, companyId);
  }
}
