import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { CompanyDocument, CompanyModelName } from '../models/company.model';

@Injectable()
export class CompanyRepository extends AbstractRepository<CompanyDocument> {
  constructor(@InjectModel(CompanyModelName) Company: Model<CompanyDocument>) {
    super(Company);
  }
}
