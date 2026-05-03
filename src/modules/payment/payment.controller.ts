import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseArrayPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { PaymentStatus } from 'src/DB/models/payment.model';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // إضافة خطة دفع (مصفوفة من الأقساط)
  @Post('deal/:dealId')
  @Roles(Role.company_admin, Role.manager) // إنشاء الجداول المالية عادة من صلاحيات المدير
  async createPaymentPlan(
    @Param('dealId', ParseObjectIdPipe) dealId: Types.ObjectId,
    @Body(new ParseArrayPipe({ items: CreatePaymentDto }))
    payments: CreatePaymentDto[],
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.paymentService.createPaymentPlan(dealId, payments, companyId);
  }

  // استعراض المدفوعات (يفيد في استخراج كشف حساب المتأخرات)
  @Get()
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async findAll(
    @User('company_id') companyId: Types.ObjectId,
    @Query('dealId') dealId?: Types.ObjectId,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentService.findAll(companyId, dealId, status);
  }

  // تسديد الدفعة مع رفع صورة الإيصال (Receipt)
  @Patch(':id/pay')
  @Roles(Role.company_admin, Role.manager, Role.agent)
  @UseInterceptors(FileInterceptor('receipt'))
  async markAsPaid(
    @Param('id', ParseObjectIdPipe) paymentId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
    @UploadedFile() file?: Express.Multer.File,
    @Body() body?: UpdatePaymentStatusDto,
  ) {
    return this.paymentService.markAsPaid(
      paymentId,
      companyId,
      file,
      body?.notes,
    );
  }

  // تحويل الدفعة لمتأخرة يدوياً
  @Patch(':id/overdue')
  @Roles(Role.company_admin, Role.manager)
  async markAsOverdue(
    @Param('id', ParseObjectIdPipe) paymentId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.paymentService.markAsOverdue(paymentId, companyId);
  }
}
