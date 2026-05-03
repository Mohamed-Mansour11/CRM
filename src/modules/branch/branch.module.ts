import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from 'src/DB/models/branch.model';
// 1. استيراد المستودع
import { BranchRepository } from 'src/DB/repositories/branch.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
  ],
  controllers: [BranchController],
  // 2. تسجيل المستودع هنا بجانب الـ Service ليتعرف عليه NestJS
  providers: [BranchService, BranchRepository],
  // 3. (اختياري ولكن مفضل) تصديره لاحتمالية استخدامه في موديولات أخرى
  exports: [BranchService, BranchRepository],
})
export class BranchModule {}
