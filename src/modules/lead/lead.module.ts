import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { LeadRepository } from 'src/DB/repositories/lead.repository';
import { Lead, LeadSchema } from 'src/DB/models/lead.model';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ], // تسجيل الموديل ليتم حقنه في الـ Repository
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
  exports: [LeadService, LeadRepository],
})
export class LeadModule {}
