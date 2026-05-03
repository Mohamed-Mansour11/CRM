import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { Types } from 'mongoose';
import { ActivityService } from './activity.service';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @Roles(Role.company_admin, Role.manager) // السجلات الحساسة للمديرين فقط
  async getActivities(
    @User('company_id') companyId: Types.ObjectId,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('entityId') entityId?: Types.ObjectId,
  ) {
    return this.activityService.getCompanyActivities(companyId, page, entityId);
  }
}
