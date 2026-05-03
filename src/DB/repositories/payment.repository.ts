import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { PaymentDocument, PaymentModelName } from '../models/payment.model';

@Injectable()
export class PaymentRepository extends AbstractRepository<PaymentDocument> {
  constructor(@InjectModel(PaymentModelName) Payment: Model<PaymentDocument>) {
    super(Payment);
  }
}
