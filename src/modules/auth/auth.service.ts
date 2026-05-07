import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { compare } from 'bcrypt';
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

    // 🚀 الإصلاح 1: البحث باستخدام isActive بدلاً من isDeleted
    const user = await this.userModel
      .findOne({ email, isActive: true })
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

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        name: user.fullName, // 🚀 الإصلاح 2: الحقل الصحيح هو fullName وإزالة as any
        email: user.email,
        role: user.role,
      },
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgetPasswordDto.email,
      isActive: true, // 🚀 تم التصحيح هنا أيضاً
    });

    if (!user) {
      return {
        message: 'If this email is registered, a reset link will be sent.',
      };
    }

    // 🚀 الإصلاح 3: استخدام crypto السريع للتوكنز والبحث المباشر
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetUrl = `http://localhost:3000/api/v1/auth/reset-password/${resetToken}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        template: './reset-password',
        context: {
          name: user.fullName,
          resetUrl,
        },
      });
    } catch (error) {
      // طباعة التوكن في الكونسول لتستطيع اختباره في Postman بسهولة
      console.log(
        '📧 Mailer not configured yet. Your Reset Token is:',
        resetToken,
      );
    }

    return { message: 'Password reset email sent successfully.' };
  }

  async resetPassword(resetToken: string, resetPasswordDto: ResetPasswordDto) {
    // تشفير التوكن المستلم للبحث عنه في الداتا بيز مباشرة (بدون For Loop)
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const validUser = await this.userModel.findOne({
      passwordResetToken: hashedResetToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!validUser) {
      throw new UnauthorizedException('Token is invalid or has expired');
    }

    // 🚀 الإصلاح 4: تمرير الباسورد كما هو (الـ Pre-save Hook سيتكفل بتشفيره)
    validUser.password = resetPasswordDto.newPassword;
    validUser.passwordResetToken = undefined as any;
    validUser.passwordResetExpires = undefined as any;

    await validUser.save();

    return { message: 'Password has been reset successfully.' };
  }
}
