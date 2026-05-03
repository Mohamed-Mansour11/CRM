import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProjectRepository } from 'src/DB/repositories/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly _ProjectRepository: ProjectRepository) {}

  async create(data: any, companyId: Types.ObjectId) {
    const project = await this._ProjectRepository.create({
      ...data,
      company_id: companyId, // 🚀 تأمين العزل
    });
    return { message: 'Project created successfully', data: project };
  }

  async findAll(companyId: Types.ObjectId) {
    return this._ProjectRepository.findAll({
      companyId, // 🚀 تأمين العزل
      sort: { createdAt: -1 },
    });
  }
}
