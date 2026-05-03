import { Controller, Get, Post, Body } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProjectService } from './project.service';
import { User } from 'src/common/decorators/user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.company_admin, Role.manager, Role.data_entry)
  async create(
    @Body() data: any,
    @User('company_id') companyId: Types.ObjectId,
  ) {
    return this.projectService.create(data, companyId);
  }

  @Get()
  @Roles(Role.company_admin, Role.manager, Role.agent)
  async findAll(@User('company_id') companyId: Types.ObjectId) {
    return this.projectService.findAll(companyId);
  }
}
