import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // وسيلة NestJS الرسمية للتدوين

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startAt = Date.now(); // حساب وقت بداية الطلب

    // عند انتهاء الطلب وإرسال الرد للمستخدم
    response.on('finish', () => {
      const { statusCode } = response;
      const duration = Date.now() - startAt; // حساب المدة المستغرقة بالملي ثانية

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
