import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { UpdateMatchStatusDto } from './dto/update-match-status.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // تشغيل خوارزمية المطابقة التلقائية يدوياً للشركة
  @Post('auto-match')
  @Roles(Role.company_admin, Role.sales_manager)
  async triggerAutoMatch(@User() user: JwtPayload) {
    return await this.matchService.generateAutoMatches(user.company_id);
  }

  // استعراض العقارات المطابقة لعميل محدد
  @Get('lead/:leadId')
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async getLeadMatches(
    @Param('leadId') leadId: Types.ObjectId,
    @User() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.matchService.getMatchesForLead(
      leadId,
      user.company_id,
      Number(page),
      Number(limit),
    );
  }

  // تغيير حالة المطابقة (مقبول، مرفوض، قيد التفاوض)
  @Patch(':id/status')
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async updateStatus(
    @Param('id') id: Types.ObjectId,
    @Body() updateMatchStatusDto: UpdateMatchStatusDto,
    @User() user: JwtPayload,
  ) {
    return await this.matchService.updateMatchStatus(
      id,
      updateMatchStatusDto,
      user.company_id,
    );
  }
}
