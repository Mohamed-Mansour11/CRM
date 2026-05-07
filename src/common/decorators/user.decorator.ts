import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export const User = createParamDecorator(
  // تحديد النوع ليكون إما حقل من حقول JwtPayload أو undefined
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // إذا تم تمرير اسم حقل (مثل company_id)، نرجع قيمته فقط.
    // وإلا، نرجع كائن المستخدم بالكامل.
    return data ? user?.[data] : user;
  },
);
