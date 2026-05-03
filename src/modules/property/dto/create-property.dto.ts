import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PropertyType, Purpose } from 'src/DB/enums/lead.enum';
import { PropertyStatus } from 'src/DB/enums/property.enum';

export class CreatePropertyDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  type!: PropertyType;

  @IsEnum(Purpose)
  @IsNotEmpty()
  purpose!: Purpose;

  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  areaSqm!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  floor?: number;

  @IsString()
  @IsNotEmpty()
  locationCity!: string;

  @IsString()
  @IsOptional()
  locationDistrict?: string;

  @IsString()
  @IsOptional()
  description?: string;

  // سنستقبل قائمة المميزات كنص مفصول بفاصلة ونحوله لمصفوفة، أو كمصفوفة مباشرة
  @IsOptional()
  amenities?: string[] | string;
}
