import { Controller, Get, Patch, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationService } from './notification.service';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Roles(Role.company_admin, Role.manager, Role.agent, Role.data_entry)
  async getMyNotifications(
    @User('_id') userId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.notificationService.getUserNotifications(userId, companyId);
  }

  @Patch(':id/read')
  @Roles(Role.company_admin, Role.manager, Role.agent, Role.data_entry)
  async markAsRead(
    @Param('id', ParseObjectIdPipe) notificationId: Types.ObjectId,
    @User('_id') userId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.notificationService.markAsRead(
      notificationId,
      userId,
      companyId,
    );
  }
}
