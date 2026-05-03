import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { PropertyDocument, PropertyModelName } from '../models/property.model';

@Injectable()
export class PropertyRepository extends AbstractRepository<PropertyDocument> {
  constructor(
    @InjectModel(PropertyModelName) Property: Model<PropertyDocument>,
  ) {
    super(Property);
  }
}
