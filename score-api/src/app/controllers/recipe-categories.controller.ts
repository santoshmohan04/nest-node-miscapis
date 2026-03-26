import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { RecipeCategoriesService } from '../service/recipe-categories.service';
import { CreateRecipeCategoryDto } from '../dto/create-recipe-category.dto';
import { RecipeCategory } from '../schema/recipe-category.schema';
import { RecipeCategoryResponseDto } from '../dto/recipe-category-response.dto';

@Controller('api/recipe-categories')
export class RecipeCategoriesController {
  constructor(private readonly recipeCategoriesService: RecipeCategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<RecipeCategoryResponseDto[]> {
    return this.recipeCategoriesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createRecipeCategoryDto: CreateRecipeCategoryDto,
  ): Promise<RecipeCategory> {
    return this.recipeCategoriesService.create(createRecipeCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.recipeCategoriesService.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
