import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from 'src/DB/models/user.model';
import { Token, TokenSchema } from 'src/DB/models/token.model';
import { TokenRepository } from 'src/DB/repositories/token.repository';
import { UserRepository } from 'src/DB/repositories/user.repository';

@Module({
  imports: [
    // تسجيل نماذج قاعدة البيانات المطلوبة
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    // إعداد الـ JWT باستخدام متغيرات البيئة
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // صلاحية التوكن يوم واحد
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, TokenRepository],
  exports: [AuthService, UserRepository, TokenRepository],
})
export class AuthModule {}
