import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { ActivityRepository } from 'src/DB/repositories/activity.repository';
import { ActivityModel } from 'src/DB/models/activity.model';

@Module({
  imports: [ActivityModel],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository],
  exports: [ActivityService], // 🚀 تصدير الـ Service لتستخدمه باقي الموديولات
})
export class ActivityModule {}
