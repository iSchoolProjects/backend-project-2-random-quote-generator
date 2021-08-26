import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Category } from '../../entity/category/category.entity';
import { User } from '../../entity/user/user.entity';

export class CreateQuoteDto {
  @ApiProperty({ default: '' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ default: '' })
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  category: Category;
}
