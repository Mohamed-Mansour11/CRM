import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentRepository } from 'src/DB/repositories/payment.repository';
import { VisitRepository } from 'src/DB/repositories/visit.repository';
import { NotificationService } from '../notification/notification.service';
import { PaymentStatus } from 'src/DB/models/payment.model';
import { VisitStatus } from 'src/DB/enums/visit.enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly _PaymentRepository: PaymentRepository,
    private readonly _VisitRepository: VisitRepository,
    private readonly _NotificationService: NotificationService,
  ) {}

  // 1. فحص يومي منتصف الليل: تحويل الدفعات المتأخرة وإرسال إشعارات
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleOverduePayments() {
    this.logger.log('Running nightly check for overdue payments...');

    const today = new Date();

    // جلب كل الأقساط التي ميعادها قبل اليوم وما زالت pending
    const overduePayments = await this._PaymentRepository.model
      .find({
        status: PaymentStatus.pending,
        dueDate: { $lt: today },
      })
      .populate('deal'); // نحتاج الـ deal لمعرفة الـ Agent والـ Company

    for (const payment of overduePayments) {
      payment.status = PaymentStatus.overdue;
      await payment.save();

      const deal = payment.deal as any;

      // إرسال إشعار لحظي للوسيط (Agent) المسؤول عن الصفقة
      await this._NotificationService.sendNotification(
        deal.company_id,
        deal.agent,
        'Payment Overdue!',
        `Installment #${payment.installmentNumber} of ${payment.amount} EGP is now overdue. Please follow up with the client.`,
        'alert',
      );
    }
  }

  // 2. فحص يومي الساعة 8 صباحاً: تذكير بزيارات الغد
  @Cron('0 8 * * *')
  async remindUpcomingVisits() {
    this.logger.log('Sending reminders for upcoming visits...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    const upcomingVisits = await this._VisitRepository.model.find({
      status: VisitStatus.scheduled,
      scheduledAt: { $gte: startOfTomorrow, $lte: endOfTomorrow },
    });

    for (const visit of upcomingVisits) {
      await this._NotificationService.sendNotification(
        visit.company_id,
        visit.agent as any,
        'Upcoming Visit Tomorrow',
        `You have a scheduled visit tomorrow at ${visit.scheduledAt.toLocaleTimeString()}.`,
        'reminder',
      );
    }
  }
}
