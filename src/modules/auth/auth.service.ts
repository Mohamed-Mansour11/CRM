import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { compare, hash } from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userModel
      .findOne({ email, isDeleted: false })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user._id,
      role: user.role,
      company_id: user.company_id,
    };

    // أضف any هنا
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        name: (user as any).name,
        email: (user as any).email,
        role: (user as any).role,
      },
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgetPasswordDto.email,
      isDeleted: false,
    });

    if (!user) {
      // نرجع رسالة نجاح وهمية لأسباب أمنية (لمنع المخترقين من معرفة الإيميلات المسجلة)
      return {
        message: 'If this email is registered, a reset link will be sent.',
      };
    }

    // توليد رمز سري مؤقت
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await hash(resetToken, 10);

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // صالح لـ 15 دقيقة
    await user.save();

    // إرسال الإيميل (يفضل نقله لـ Message Queue مستقبلاً كما ناقشنا)
    const resetUrl = `http://localhost:3000/api/v1/auth/reset-password/${resetToken}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      template: './reset-password', // قالب الـ Handlebars
      context: {
        name: (user as any).name,
        resetUrl,
      },
    });

    return { message: 'Password reset email sent successfully.' };
  }

  async resetPassword(resetToken: string, resetPasswordDto: ResetPasswordDto) {
    // في الواقع العملي، يجب فحص التوكن المشفر مع التوكن المخزن في قاعدة البيانات
    // هذا مجرد تبسيط لمنطق البحث عن المستخدم الذي يمتلك توكن صالح
    const users = await this.userModel
      .find({
        passwordResetExpires: { $gt: new Date() },
      })
      .select('+passwordResetToken');

    // قم بتغيير السطر ليصبح هكذا
    let validUser: any = null;
    for (const user of users) {
      if (await compare(resetToken, user.passwordResetToken)) {
        validUser = user;
        break;
      }
    }

    if (!validUser) {
      throw new UnauthorizedException('Token is invalid or has expired');
    }

    // تشفير كلمة المرور الجديدة
    validUser.password = await hash(resetPasswordDto.newPassword, 10);
    validUser.passwordResetToken = undefined;
    validUser.passwordResetExpires = undefined;
    await validUser.save();

    return { message: 'Password has been reset successfully.' };
  }
}
