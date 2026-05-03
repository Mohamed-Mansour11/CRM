import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';

@Controller('analytics')
// حصر الوصول للتحليلات على المديرين فقط
@Roles(Role.company_admin, Role.sales_manager)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardSummary(@User() user: JwtPayload) {
    // إرجاع ملخص سريع (عدد العملاء، الصفقات الناجحة، الإيرادات) للشركة الخاصة بالمستخدم
    return await this.analyticsService.getDashboardSummary(user.company_id);
  }

  @Get('sales-performance')
  async getSalesPerformance(
    @User() user: JwtPayload,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // تقرير أداء المبيعات خلال فترة زمنية محددة
    return await this.analyticsService.getSalesPerformance(
      user.company_id,
      startDate,
      endDate,
    );
  }
}
