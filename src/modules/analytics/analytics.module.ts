import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';

// استيراد الـ Schemas المطلوبة للإحصائيات
import { LeadModelName, LeadSchema } from 'src/DB/models/lead.model';
import { DealModelName, DealSchema } from 'src/DB/models/deal.model';
import {
  PropertyModelName,
  PropertySchema,
} from 'src/DB/models/property.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeadModelName, schema: LeadSchema },
      { name: DealModelName, schema: DealSchema },
      { name: PropertyModelName, schema: PropertySchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
