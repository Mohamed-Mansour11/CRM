import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { VisitDocument, VisitModelName } from '../models/visit.model';

@Injectable()
export class VisitRepository extends AbstractRepository<VisitDocument> {
  constructor(@InjectModel(VisitModelName) Visit: Model<VisitDocument>) {
    super(Visit);
  }
}
