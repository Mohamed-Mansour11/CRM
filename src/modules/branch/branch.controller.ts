import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Types } from 'mongoose';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @Roles(Role.company_admin) // المدير فقط من يضيف فروعاً
  async create(
    @Body() data: CreateBranchDto,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.branchService.create(data, companyId);
  }

  @Get()
  @Roles(Role.company_admin, Role.manager)
  async findAll(@User('company_id') companyId: Types.ObjectId) {
    return this.branchService.findAll(companyId);
  }

  @Delete(':id')
  @Roles(Role.company_admin)
  async remove(
    @Param('id', ParseObjectIdPipe) branchId: Types.ObjectId,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.branchService.remove(branchId, companyId);
  }
}
