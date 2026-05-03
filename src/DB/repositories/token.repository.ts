import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { Token } from '../models/token.model';

@Injectable()
export class TokenRepository extends AbstractRepository<Token> {
  protected readonly logger = new Logger(TokenRepository.name);
  constructor(@InjectModel(Token.name) tokenModel: Model<Token>) {
    super(tokenModel);
  }
}
