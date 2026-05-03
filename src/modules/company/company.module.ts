import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from 'src/DB/repositories/company.repository';
import { UserRepository } from 'src/DB/repositories/user.repository';
import { CompanyModel } from 'src/DB/models/company.model';
import { UserModel } from 'src/DB/models/user.model';

@Module({
  imports: [CompanyModel, UserModel],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, UserRepository],
  exports: [CompanyService, CompanyRepository],
})
export class CompanyModule {}
