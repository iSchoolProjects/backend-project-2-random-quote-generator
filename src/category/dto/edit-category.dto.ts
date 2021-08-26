import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entity/category/category.entity';

export class EditCategoryDto {
  @ApiProperty({ default: '' })
  title: string;

  @ApiProperty()
  parent: Category;
}
