import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const i18n = I18nContext.current(host);

    // 1. تحديد كود الحالة (Status Code)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. استخراج رسالة الخطأ ومعالجتها
    let message = exception.message || 'Internal server error';

    // إذا كان الخطأ قادماً من ValidationPipe (أخطاء الـ DTO)
    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;
    if (
      exceptionResponse &&
      typeof exceptionResponse === 'object' &&
      exceptionResponse.message
    ) {
      message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message[0]
        : exceptionResponse.message;
    }

    // 3. محاولة ترجمة الرسالة إذا كانت مسجلة في ملفات i18n
    try {
      if (i18n) {
        // نبحث عن الترجمة، إذا لم توجد نترك الرسالة كما هي
        const translated = i18n.t(`events.${message}`);
        if (translated !== `events.${message}`) {
          message = translated;
        }
      }
    } catch (e) {
      // في حالة فشل الترجمة نكتفي بالرسالة الأصلية
    }

    // 4. تسجيل الخطأ في الـ Logs (الصندوق الأسود)
    this.logger.error(
      `Http Status: ${status} Error Message: ${JSON.stringify(message)} Path: ${request.url}`,
      exception instanceof Error ? exception.stack : '',
    );

    // 5. إرسال الاستجابة الموحدة للـ Front-end
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      // في بيئة التطوير فقط نرسل تفاصيل الخطأ (Stack)
      stack:
        process.env.NODE_ENV === 'development' ? exception.stack : undefined,
    });
  }
}
