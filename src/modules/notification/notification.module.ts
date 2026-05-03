import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationRepository } from 'src/DB/repositories/notification.repository';
import { NotificationModel } from 'src/DB/models/notification.model';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [NotificationModel, JwtModule, UserModule, AuthModule], // نحتاج لـ UserModule و Jwt للـ Gateway
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, NotificationGateway],
  exports: [NotificationService], //  لتتمكن الـ Services الأخرى من إرسال الإشعارات
})
export class NotificationModule {}
