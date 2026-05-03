import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { BranchDocument, BranchModelName } from '../models/branch.model';

@Injectable()
export class BranchRepository extends AbstractRepository<BranchDocument> {
  constructor(@InjectModel(BranchModelName) Branch: Model<BranchDocument>) {
    super(Branch);
  }
}
