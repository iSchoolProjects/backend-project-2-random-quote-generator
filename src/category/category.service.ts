import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from '../repository/category/category.repository';
import { Category } from '../entity/category/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { EditCategoryDto } from './dto/edit-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: CategoryRepository,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category: Category = new Category(createCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOneCategory(id: number): Promise<Category> {
    try {
      return await this.categoryRepository.findOneOrFail(id);
    } catch (error) {
      return error.message;
    }
  }

  async editCategory(
    id: number,
    editCategoryDto: EditCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(id, editCategoryDto);
  }

  async deleteCategory(id): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }
}
