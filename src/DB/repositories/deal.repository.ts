import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { DealDocument, DealModelName } from '../models/deal.model';

@Injectable()
export class DealRepository extends AbstractRepository<DealDocument> {
  constructor(@InjectModel(DealModelName) Deal: Model<DealDocument>) {
    super(Deal);
  }
}
