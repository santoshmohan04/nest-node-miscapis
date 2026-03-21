import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { RecipesService } from '../service/recipes.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { RecipeQueryDto } from '../dto/recipe-query.dto';
import { PaginatedRecipesWithRatingsResponseDto } from '../dto/recipe-with-rating.dto';
import { RecipeWithRatingDto } from '../dto/recipe-with-rating.dto';
import { Recipe } from '../schema/recipe.schema';

@Controller('api/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query(ValidationPipe) queryDto: RecipeQueryDto,
  ): Promise<PaginatedRecipesWithRatingsResponseDto> {
    return this.recipesService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<RecipeWithRatingDto> {
    return this.recipesService.findOne(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Recipe> {
    return this.recipesService.remove(id);
  }
}
