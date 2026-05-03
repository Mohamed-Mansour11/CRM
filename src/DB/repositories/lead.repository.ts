import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { Lead, LeadModelName } from '../models/lead.model';

@Injectable()
export class LeadRepository extends AbstractRepository<Lead> {
  constructor(@InjectModel(LeadModelName) Lead: Model<Lead>) {
    super(Lead);
  }
}
