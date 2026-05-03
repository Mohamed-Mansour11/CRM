import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { UserModel } from 'src/DB/models/user.model';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [UserModel, CompanyModule], // استيراد CompanyModule لقرائة بيانات الاشتراك
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
