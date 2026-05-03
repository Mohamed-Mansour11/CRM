import { Controller, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Public() // السماح بالوصول بدون توكن (لأنها عملية تسجيل جديدة)
  @Post('register')
  async register(@Body() data: RegisterCompanyDto) {
    return this.companyService.create(data);
  }
}
