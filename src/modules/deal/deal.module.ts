import { Module } from '@nestjs/common';
import { DealService } from './deal.service';
import { DealController } from './deal.controller';
import { DealRepository } from 'src/DB/repositories/deal.repository';
import { DealModel } from 'src/DB/models/deal.model';
import { LeadModule } from '../lead/lead.module';
import { PropertyModule } from '../property/property.module';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
@Module({
  imports: [DealModel, LeadModule, PropertyModule, CloudinaryModule],
  controllers: [DealController],
  providers: [DealService, DealRepository],
  exports: [DealService, DealRepository],
})
export class DealModule {}
