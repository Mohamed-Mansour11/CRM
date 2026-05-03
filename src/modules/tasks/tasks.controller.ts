import { Controller, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/DB/enums/user.enum';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('trigger-matching')
  @Roles(Role.super_admin, Role.company_admin)
  async triggerAutoMatching() {
    return { message: 'Auto-matching triggered' };
  }
}
