import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rating, RatingDocument } from '../schema/rating.schema';
import { Recipe, RecipeDocument } from '../schema/recipe.schema';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { RatingResponseDto, RecipeRatingsResponseDto } from '../dto/rating-response.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name, 'estore') 
    private ratingModel: Model<RatingDocument>,
    @InjectModel(Recipe.name, 'estore')
    private recipeModel: Model<RecipeDocument>,
  ) {}

  async createOrUpdateRating(
    userId: string,
    recipeId: string,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    // Check if recipe exists
    const recipe = await this.recipeModel.findById(recipeId).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
    }

    // Check if user already rated this recipe
    const existingRating = await this.ratingModel
      .findOne({ userId, recipeId })
      .exec();

    if (existingRating) {
      // Update existing rating
      existingRating.rating = createRatingDto.rating;
      return existingRating.save();
    }

    // Create new rating
    const rating = new this.ratingModel({
      userId,
      recipeId,
      rating: createRatingDto.rating,
    });
    return rating.save();
  }

  async getRecipeRatings(recipeId: string): Promise<RecipeRatingsResponseDto> {
    // Check if recipe exists
    const recipe = await this.recipeModel.findById(recipeId).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
    }

    // Get all ratings for the recipe
    const ratings = await this.ratingModel
      .find({ recipeId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Calculate average rating
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    // Map ratings to response DTOs
    const ratingResponses: RatingResponseDto[] = ratings.map(rating => ({
      id: rating._id.toString(),
      rating: rating.rating,
      recipeId: rating.recipeId,
      userId: rating.userId,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    }));

    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings,
      ratings: ratingResponses,
    };
  }

  async getAverageRating(recipeId: string): Promise<{ averageRating: number; totalRatings: number }> {
    const ratings = await this.ratingModel
      .find({ recipeId })
      .select('rating')
      .lean()
      .exec();

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
    };
  }

  async getUserRatingForRecipe(userId: string, recipeId: string): Promise<Rating | null> {
    return this.ratingModel.findOne({ userId, recipeId }).lean().exec();
  }

  async getAverageRatingsForRecipes(recipeIds: string[]): Promise<Map<string, { averageRating: number; totalRatings: number }>> {
    const ratings = await this.ratingModel
      .find({ recipeId: { $in: recipeIds } })
      .select('recipeId rating')
      .lean()
      .exec();

    // Group ratings by recipeId
    const ratingsByRecipe = new Map<string, number[]>();
    
    ratings.forEach(rating => {
      if (!ratingsByRecipe.has(rating.recipeId)) {
        ratingsByRecipe.set(rating.recipeId, []);
      }
      const recipeRatings = ratingsByRecipe.get(rating.recipeId);
      if (recipeRatings) {
        recipeRatings.push(rating.rating);
      }
    });

    // Calculate average for each recipe
    const result = new Map<string, { averageRating: number; totalRatings: number }>();
    
    ratingsByRecipe.forEach((ratings, recipeId) => {
      const totalRatings = ratings.length;
      const averageRating = ratings.reduce((sum, r) => sum + r, 0) / totalRatings;
      result.set(recipeId, {
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
      });
    });

    return result;
  }
}
