import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // التحقق مما إذا كان المسار يحتوي على ديكوريتور @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // إذا كان المسار عاماً، نسمح بالمرور دون فحص التوكن
    if (isPublic) {
      return true;
    }

    // إذا لم يكن عاماً، نمرر الطلب للـ AuthGuard الأصلي ليقوم بفك تشفير التوكن
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // تخصيص رسالة الخطأ في حالة عدم وجود التوكن أو انتهاء صلاحيته
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'You must be logged in to access this resource',
        )
      );
    }
    return user; // يتم إضافة الـ user إلى الـ Request
  }
}
