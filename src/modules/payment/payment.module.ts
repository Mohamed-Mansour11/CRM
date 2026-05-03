import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from 'src/DB/repositories/payment.repository';
import { PaymentModel } from 'src/DB/models/payment.model';
import { DealModule } from '../deal/deal.module';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
@Module({
  imports: [PaymentModel, DealModule, CloudinaryModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
