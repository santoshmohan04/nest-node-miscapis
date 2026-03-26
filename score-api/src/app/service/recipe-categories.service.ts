import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeCategory, RecipeCategoryDocument } from '../schema/recipe-category.schema';
import { CreateRecipeCategoryDto } from '../dto/create-recipe-category.dto';
import { RecipeCategoryResponseDto } from '../dto/recipe-category-response.dto';

@Injectable()
export class RecipeCategoriesService {
  constructor(
    @InjectModel(RecipeCategory.name, 'recipes') 
    private recipeCategoryModel: Model<RecipeCategoryDocument>,
  ) {}

  async create(createRecipeCategoryDto: CreateRecipeCategoryDto): Promise<RecipeCategory> {
    // Check if category already exists
    const existingCategory = await this.recipeCategoryModel
      .findOne({ name: createRecipeCategoryDto.name })
      .exec();

    if (existingCategory) {
      throw new ConflictException(`Category "${createRecipeCategoryDto.name}" already exists`);
    }

    const category = new this.recipeCategoryModel(createRecipeCategoryDto);
    return category.save();
  }

  async findAll(): Promise<RecipeCategoryResponseDto[]> {
    const categories = await this.recipeCategoryModel
      .find()
      .sort({ name: 1 })
      .lean()
      .exec();

    return categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      icon: category.icon,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
  }

  async findById(id: string): Promise<RecipeCategory> {
    const category = await this.recipeCategoryModel.findById(id).exec();
    
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    
    return category;
  }

  async delete(id: string): Promise<void> {
    const category = await this.recipeCategoryModel.findByIdAndDelete(id).exec();
    
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }

  async getCategoryByName(name: string): Promise<RecipeCategory | null> {
    return this.recipeCategoryModel.findOne({ name }).lean().exec();
  }
}
