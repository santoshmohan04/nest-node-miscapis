import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Recipe, RecipeDocument } from '../schema/recipe.schema';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { RecipeQueryDto } from '../dto/recipe-query.dto';
import { PaginatedRecipesResponseDto } from '../dto/paginated-recipes-response.dto';
import { RecipeWithRatingDto, PaginatedRecipesWithRatingsResponseDto } from '../dto/recipe-with-rating.dto';
import { RatingsService } from './ratings.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name, 'recipes') private recipeModel: Model<RecipeDocument>,
    @Inject(forwardRef(() => RatingsService))
    private ratingsService: RatingsService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const createdRecipe = new this.recipeModel(createRecipeDto);
    return createdRecipe.save();
  }

  async findAll(queryDto: RecipeQueryDto): Promise<PaginatedRecipesWithRatingsResponseDto> {
    const { page = 1, limit = 10, search, category, difficulty, authorId } = queryDto;

    // Build filter query
    const filter: FilterQuery<RecipeDocument> = {};

    // Text search on title and description
    if (search) {
      filter.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by difficulty
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Filter by author
    if (authorId) {
      filter.authorId = authorId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel for better performance
    const [recipes, totalItems] = await Promise.all([
      this.recipeModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.recipeModel.countDocuments(filter).exec(),
    ]);

    // Get ratings for all recipes
    const recipeIds = recipes.map(r => r._id.toString());
    const ratingsMap = await this.ratingsService.getAverageRatingsForRecipes(recipeIds);

    // Combine recipes with ratings
    const data: RecipeWithRatingDto[] = recipes.map(recipe => {
      const recipeId = recipe._id.toString();
      const ratingInfo = ratingsMap.get(recipeId);
      return {
        ...recipe,
        averageRating: ratingInfo?.averageRating || 0,
        totalRatings: ratingInfo?.totalRatings || 0,
      };
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      page,
      totalPages,
      totalItems,
    };
  }

  async findOne(id: string): Promise<RecipeWithRatingDto> {
    const recipe = await this.recipeModel.findById(id).lean().exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }

    // Get rating info
    const ratingInfo = await this.ratingsService.getAverageRating(id);

    return {
      ...recipe,
      averageRating: ratingInfo.averageRating,
      totalRatings: ratingInfo.totalRatings,
    };
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const updatedRecipe = await this.recipeModel
      .findByIdAndUpdate(id, updateRecipeDto, { new: true })
      .exec();
    
    if (!updatedRecipe) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }
    
    return updatedRecipe;
  }

  async remove(id: string): Promise<Recipe> {
    const deletedRecipe = await this.recipeModel.findByIdAndDelete(id).exec();
    
    if (!deletedRecipe) {
      throw new NotFoundException(`Recipe with ID "${id}" not found`);
    }
    
    return deletedRecipe;
  }

  async findByCategory(category: string): Promise<Recipe[]> {
    return this.recipeModel.find({ category }).exec();
  }

  async findByAuthor(authorId: string): Promise<Recipe[]> {
    return this.recipeModel.find({ authorId }).exec();
  }

  async findByDifficulty(difficulty: string): Promise<Recipe[]> {
    return this.recipeModel.find({ difficulty }).exec();
  }
}
