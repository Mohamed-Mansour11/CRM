import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserService } from './user.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { ParseBoolPipe } from '@nestjs/common';

@Controller('team') // تم تسميته team ليكون أوضح في الـ API
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.company_admin, Role.manager) // فقط المديرين يمكنهم إضافة موظفين
  async createEmployee(
    @Body() data: CreateEmployeeDto,
    @User('company_id') companyId: Types.ObjectId,
    @User('sub') currentUserId: Types.ObjectId,
  ) {
    return this.userService.createEmployee(data, companyId, currentUserId);
  }

  @Get()
  @Roles(Role.company_admin, Role.manager)
  async getTeam(@User('company_id') companyId: Types.ObjectId) {
    return this.userService.getTeam(companyId);
  }

  // 🚀 إضافة الـ Endpoint الجديدة لجلب موظفي المبيعات من أجل الـ Dropdown
  @Get('agents')
  // يمكن تركها بدون @Roles ليتمكن أي مستخدم مسجل بالشركة من رؤية القائمة وتعيين الليد
  async getSalesAgents(@User('company_id') companyId: Types.ObjectId) {
    return this.userService.getSalesAgents(companyId);
  }

  @Patch(':id/status')
  @Roles(Role.company_admin) // الأفضل أن يكون مدير الشركة فقط من يوقف الحسابات
  async toggleStatus(
    @Param('id', ParseObjectIdPipe) employeeId: Types.ObjectId,
    @Body('isActive', ParseBoolPipe) isActive: boolean,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.userService.toggleEmployeeStatus(
      employeeId,
      companyId,
      isActive,
    );
  }
}
