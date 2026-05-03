import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { MatchDocument, MatchModelName } from '../models/match.model';

@Injectable()
export class MatchRepository extends AbstractRepository<MatchDocument> {
  constructor(@InjectModel(MatchModelName) Match: Model<MatchDocument>) {
    super(Match);
  }
}
