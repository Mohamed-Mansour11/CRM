import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PaymentRepository } from 'src/DB/repositories/payment.repository';
import { DealRepository } from 'src/DB/repositories/deal.repository';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from 'src/DB/models/payment.model';

@Injectable()
export class PaymentService {
  constructor(
    private readonly _PaymentRepository: PaymentRepository,
    private readonly _DealRepository: DealRepository,
    private readonly _CloudinaryService: CloudinaryService,
    private readonly _ConfigService: ConfigService,
  ) {}

  // 1. إنشاء خطة دفع كاملة لصفقة معينة
  async createPaymentPlan(
    dealId: Types.ObjectId,
    payments: CreatePaymentDto[],
    companyId: Types.ObjectId,
  ) {
    // التأكد من أن الصفقة موجودة وتتبع لشركتنا
    const deal = await this._DealRepository.findOne({
      filter: { _id: dealId },
      companyId,
    });
    if (!deal) throw new NotFoundException('Deal not found!');

    // التحقق من أن مجموع الأقساط يساوي أو يقل عن قيمة الصفقة (خطوة Business Logic ممتازة)
    const totalPayments = payments.reduce((acc, curr) => acc + curr.amount, 0);
    if (deal.agreedPrice && totalPayments > deal.agreedPrice) {
      throw new BadRequestException(
        'Total payment amounts exceed the agreed deal price!',
      );
    }

    const createdPayments: any[] = [];

    // إنشاء الأقساط والمقدمات
    for (const paymentData of payments) {
      const payment = await this._PaymentRepository.create({
        ...paymentData,
        company_id: companyId, // 🚀 تأمين SaaS
        deal: dealId,
        status: PaymentStatus.pending,
      });
      createdPayments.push(payment);
    }

    return {
      message: 'Payment plan generated successfully',
      data: createdPayments,
    };
  }

  // 2. جلب الأقساط لصفقة معينة أو جلب كل الأقساط للشركة (للمدير)
  async findAll(
    companyId: Types.ObjectId,
    dealId?: Types.ObjectId,
    status?: PaymentStatus,
  ) {
    const filterQuery: any = {};
    if (dealId) filterQuery.deal = dealId;
    if (status) filterQuery.status = status;

    const payments = await this._PaymentRepository.findAll({
      companyId, // 🚀 عزل البيانات
      filter: filterQuery,
      populate: { path: 'deal', select: 'agreedPrice stage expectedCloseDate' },
      sort: { dueDate: 1 }, // ترتيب حسب تاريخ الاستحقاق (الأقرب أولاً)
    });

    return payments;
  }

  // 3. دفع القسط وتوثيقه (Mark as Paid & Upload Receipt)
  async markAsPaid(
    paymentId: Types.ObjectId,
    companyId: Types.ObjectId,
    file?: Express.Multer.File,
    notes?: string,
  ) {
    const payment = await this._PaymentRepository.findOne({
      filter: { _id: paymentId },
      companyId,
    });
    if (!payment) throw new NotFoundException('Payment record not found!');

    if (payment.status === PaymentStatus.paid) {
      throw new BadRequestException('This payment is already marked as paid.');
    }

    const updateData: any = {
      status: PaymentStatus.paid,
      paidDate: new Date(),
    };

    if (notes) updateData.notes = notes;

    // رفع الإيصال إذا تم إرفاقه
    if (file) {
      const rootFolder = this._ConfigService.get('CLOUD_ROOT_FOLDER');
      const cloudFolder = `${rootFolder}/companies/${companyId}/payments/${payment.deal}`;

      const receiptDoc = await this._CloudinaryService.uploadFile(
        file,
        'payments/receipts',
      );
      updateData.receiptDoc = receiptDoc;
    }

    const updatedPayment = await this._PaymentRepository.update({
      companyId,
      filter: { _id: paymentId },
      update: updateData,
    });

    return {
      message: 'Payment marked as paid successfully',
      data: updatedPayment,
    };
  }

  // 4. دالة مجدولة (Cron Job) لتحديث الدفعات المتأخرة - سنكتفي بالدالة العادية هنا لتغيير الحالة يدوياً
  async markAsOverdue(paymentId: Types.ObjectId, companyId: Types.ObjectId) {
    const payment = await this._PaymentRepository.update({
      companyId,
      filter: { _id: paymentId, status: PaymentStatus.pending },
      update: { status: PaymentStatus.overdue },
    });

    if (!payment)
      throw new BadRequestException('Cannot mark this payment as overdue.');
    return { message: 'Payment is now overdue', data: payment };
  }
}
