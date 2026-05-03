import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { MatchRepository } from 'src/DB/repositories/match.repository';
import { MatchModel } from 'src/DB/models/match.model';
import { LeadModule } from '../lead/lead.module';
import { PropertyModule } from '../property/property.module';
import { Lead, LeadSchema } from 'src/DB/models/lead.model';

@Module({
  imports: [
    MatchModel,
    LeadModule, // لنتمكن من استخدام LeadRepository
    PropertyModule, // لنتمكن من استخدام PropertyRepository
  ],
  controllers: [MatchController],
  providers: [MatchService, MatchRepository],
  exports: [MatchService, MatchRepository],
})
export class MatchModule {}
