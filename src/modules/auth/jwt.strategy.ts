import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      // 1. استخراج التوكن من الهيدر (Bearer Token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. رفض التوكن إذا انتهت صلاحيته
      ignoreExpiration: false,
      // 3. مفتاح فك التشفير
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // هذه الدالة تعمل تلقائياً إذا كان التوكن سليماً
  async validate(payload: JwtPayload) {
    // زيادة في الأمان: نتأكد أن المستخدم لم يتم حذفه أو إيقافه بعد إصدار التوكن
    const user = await this.userModel.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User account is inactive or deleted.');
    }

    // ما نرجعه هنا سيتم حقنه تلقائياً في (request.user) لاستخدامه في @User
    return {
      sub: payload.sub,
      role: payload.role,
      company_id: payload.company_id,
    };
  }
}
