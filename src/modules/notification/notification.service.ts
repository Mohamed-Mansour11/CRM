import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationRepository } from 'src/DB/repositories/notification.repository';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private readonly _NotificationRepository: NotificationRepository,
    private readonly _NotificationGateway: NotificationGateway, // 🚀 حقن الـ Gateway
  ) {}

  // 1. الدالة الأساسية لإنشاء وإرسال الإشعار
  async sendNotification(
    companyId: Types.ObjectId,
    userId: Types.ObjectId,
    title: string,
    message: string,
    type: string = 'info',
  ) {
    // حفظ الإشعار في قاعدة البيانات أولاً ليراه المستخدم حتى لو لم يكن متصلاً
    const notification = await this._NotificationRepository.create({
      company_id: companyId,
      user: userId,
      title,
      message,
      type,
      isRead: false,
    });

    // إرسال الإشعار لحظياً عبر الـ WebSockets إذا كان المستخدم (Online)
    this._NotificationGateway.sendNotificationToUser(
      userId.toString(),
      notification,
    );

    return notification;
  }

  // 2. جلب إشعارات المستخدم الحالية
  async getUserNotifications(
    userId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    return this._NotificationRepository.findAll({
      companyId, // 🚀 تأمين العزل
      filter: { user: userId },
      sort: { createdAt: -1 },
      paginate: { page: 1, limit: 30 },
    });
  }

  // 3. تحديد الإشعار كـ "مقروء"
  async markAsRead(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId,
    companyId: Types.ObjectId,
  ) {
    await this._NotificationRepository.update({
      companyId,
      filter: { _id: notificationId, user: userId },
      update: { isRead: true },
    });
    return { message: 'Marked as read' };
  }
}
