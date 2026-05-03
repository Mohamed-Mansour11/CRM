import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import {
  NotificationDocument,
  NotificationModelName,
} from '../models/notification.model';

@Injectable()
export class NotificationRepository extends AbstractRepository<NotificationDocument> {
  constructor(
    @InjectModel(NotificationModelName)
    Notification: Model<NotificationDocument>,
  ) {
    super(Notification);
  }
}
