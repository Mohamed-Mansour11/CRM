import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
// تأكد من أن مسار الاستيراد أدناه يطابق ملف الـ Enum الخاص بك
// import { Role } from 'src/DB/enums/user.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // قراءة الصلاحيات المطلوبة للمسار من المزخرف @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // إذا لم يكن هناك صلاحيات محددة للمسار، اسمح بالمرور
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // استخراج بيانات المستخدم من الطلب (والتي تم حقنها مسبقاً عبر JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // إذا لم يكن هناك مستخدم أو لم يكن لديه صلاحية مسجلة، ارفض الطلب
    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied: User role not found.');
    }

    // التحقق مما إذا كان دور المستخدم موجوداً ضمن قائمة الأدوار المسموح لها
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Forbidden: You do not have the necessary permissions to access this resource.',
      );
    }

    return true; // السماح بالمرور
  }
}
