import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entity/category/category.entity';

export class EditQuoteDto {
  @ApiProperty({ default: '' })
  title: string;

  @ApiProperty({ default: '' })
  content: string;

  @ApiProperty({ default: '' })
  author: string;

  @ApiProperty()
  category: Category;

  @ApiProperty()
  isDeleted: boolean;
}
