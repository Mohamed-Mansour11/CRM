import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'src/DB/models/project.model';
import { ProjectRepository } from 'src/DB/repositories/project.repository';

@Module({
  imports: [
    // 1. تسجيل الموديل في قاعدة البيانات
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository, //  هذا هو "السيخ المفقود" الذي سبب المشكلة!
  ],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
