import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

// 🚀 استيراد الموديولات التي توفر الـ Repositories المطلوبة
import { LeadModule } from '../lead/lead.module';
import { DealModule } from '../deal/deal.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [
    // بمجرد استيراد هذه الموديولات، سيتعرف AnalyticsModule على المستودعات الخاصة بها
    LeadModule,
    DealModule,
    PropertyModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
