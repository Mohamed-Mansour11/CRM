import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { VisitRepository } from 'src/DB/repositories/visit.repository';
import { VisitModel } from 'src/DB/models/visit.model';
import { LeadModule } from '../lead/lead.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [VisitModel, LeadModule, PropertyModule],
  controllers: [VisitController],
  providers: [VisitService, VisitRepository],
  exports: [VisitService, VisitRepository],
})
export class VisitModule {}
