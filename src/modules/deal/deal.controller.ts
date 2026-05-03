import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { DealService } from './deal.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealStageDto } from './dto/update-deal-stage.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Types } from 'mongoose';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';

@Controller('deals')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async create(@Body() createDealDto: CreateDealDto, @User() user: JwtPayload) {
    return await this.dealService.create(
      createDealDto,
      user.company_id,
      user.sub,
    );
  }

  @Get()
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async findAll(
    @User() user: JwtPayload,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.dealService.findAll(
      user.company_id,
      Number(page),
      Number(limit),
    );
  }

  @Get(':id')
  @Roles(Role.company_admin, Role.sales_manager, Role.sales_agent)
  async findOne(@Param('id') id: Types.ObjectId, @User() user: JwtPayload) {
    return await this.dealService.findOne(id, user.company_id);
  }

  @Patch(':id/stage')
  @Roles(Role.company_admin, Role.sales_manager) // تغيير حالة الصفقة يتطلب صلاحيات أعلى
  async updateStage(
    @Param('id') id: Types.ObjectId,
    @Body() updateDealStageDto: UpdateDealStageDto,
    @User() user: JwtPayload,
  ) {
    return await this.dealService.updateStage(
      id,
      updateDealStageDto,
      user.company_id,
    );
  }
}
