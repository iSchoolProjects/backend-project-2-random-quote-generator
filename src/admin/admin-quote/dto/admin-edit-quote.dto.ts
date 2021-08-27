import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../entity/category/category.entity';
import { User } from '../../../entity/user/user.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AdminEditQuoteDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  category: Category;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  isDeleted: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  createdBy: User;
}
