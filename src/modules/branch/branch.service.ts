import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { BranchRepository } from 'src/DB/repositories/branch.repository';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchService {
  constructor(private readonly _BranchRepository: BranchRepository) {}

  async create(data: CreateBranchDto, companyId: Types.ObjectId) {
    const branch = await this._BranchRepository.create({
      ...data,
      company_id: companyId, // 🚀 تأمين العزل
    });
    return { message: 'Branch created successfully', data: branch };
  }

  async findAll(companyId: Types.ObjectId) {
    // جلب كل فروع الشركة
    const branches = await this._BranchRepository.findAll({
      companyId, // 🚀 تأمين العزل
      sort: { createdAt: -1 },
    });
    return branches;
  }

  async remove(branchId: Types.ObjectId, companyId: Types.ObjectId) {
    const branch = await this._BranchRepository.delete(
      { _id: branchId },
      undefined,
      companyId,
    );
    if (!branch) throw new NotFoundException('Branch not found!');
    return { message: 'Branch deleted successfully' };
  }
}
