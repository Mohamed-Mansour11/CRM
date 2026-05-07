import { SetMetadata } from '@nestjs/common';
import { Role } from '../../DB/enums/user.enum'; // تأكد من أن مسار الاستيراد صحيح بناءً على مكان الملف

export const ROLES_KEY = 'roles';

// 🚀 الآن نستخدم Role بدلاً من string
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
