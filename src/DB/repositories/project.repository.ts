import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { ProjectDocument, ProjectModelName } from '../models/project.model';

@Injectable()
export class ProjectRepository extends AbstractRepository<ProjectDocument> {
  constructor(@InjectModel(ProjectModelName) Project: Model<ProjectDocument>) {
    super(Project);
  }
}
