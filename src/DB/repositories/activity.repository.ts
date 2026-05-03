import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { ActivityDocument, ActivityModelName } from '../models/activity.model';

@Injectable()
export class ActivityRepository extends AbstractRepository<ActivityDocument> {
  constructor(
    @InjectModel(ActivityModelName) Activity: Model<ActivityDocument>,
  ) {
    super(Activity);
  }
}
