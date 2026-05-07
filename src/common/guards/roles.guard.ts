import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
// 1. تفعيل الاستيراد لربط الحارس بالـ Enum
import { Role } from 'src/DB/enums/user.enum';
// يُفضل أيضاً استيراد الواجهة لضمان نوع المستخدم
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 2. استخدام Role[] بدلاً من string[]
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    // 3. إخبار TypeScript بنوع المستخدم لتجنب أخطاء النوع
    const user = request.user as JwtPayload;

    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied: User role not found.');
    }

    // 4. التحقق الآن يتم بأمان كامل (Enum مع Enum)
    const hasRole = requiredRoles.includes(user.role as Role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Forbidden: You do not have the necessary permissions to access this resource.',
      );
    }

    return true;
  }
}
