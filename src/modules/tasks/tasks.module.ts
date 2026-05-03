import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';

// 1. استيراد النماذج (Models) المطلوبة إذا كنت تستخدم الـ Repositories مباشرة
import { Payment, PaymentSchema } from 'src/DB/models/payment.model';
import { Visit, VisitSchema } from 'src/DB/models/visit.model';

// 2. استيراد الموديولات الأخرى إذا كانت هي من توفر الـ Repositories
import { LeadModule } from '../lead/lead.module';
import { NotificationModule } from '../notification/notification.module';

// 3. استيراد الـ Repositories نفسها لتعريفها كـ Providers
import { PaymentRepository } from 'src/DB/repositories/payment.repository';
import { VisitRepository } from 'src/DB/repositories/visit.repository';

@Module({
  imports: [
    // تسجيل الموديلات في هذا الموديول ليتمكن الـ Repository من الوصول إليها
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Visit.name, schema: VisitSchema },
    ]),
    LeadModule,
    NotificationModule, // لكي نتمكن من استخدام NotificationService
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    PaymentRepository, // تسجيل الـ Repository كـ Provider هنا
    VisitRepository, // تسجيل الـ Repository كـ Provider هنا
  ],
})
export class TasksModule {}
