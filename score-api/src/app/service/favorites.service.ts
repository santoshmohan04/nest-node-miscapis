import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from '../schema/favorite.schema';
import { Recipe, RecipeDocument } from '../schema/recipe.schema';
import { FavoriteRecipeResponseDto } from '../dto/favorite-recipe-response.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name, 'estore') 
    private favoriteModel: Model<FavoriteDocument>,
    @InjectModel(Recipe.name, 'estore')
    private recipeModel: Model<RecipeDocument>,
  ) {}

  async addFavorite(userId: string, recipeId: string): Promise<Favorite> {
    // Check if recipe exists
    const recipe = await this.recipeModel.findById(recipeId).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
    }

    // Check if already favorited
    const existingFavorite = await this.favoriteModel
      .findOne({ userId, recipeId })
      .exec();

    if (existingFavorite) {
      throw new ConflictException('Recipe is already in favorites');
    }

    // Create favorite
    const favorite = new this.favoriteModel({ userId, recipeId });
    return favorite.save();
  }

  async removeFavorite(userId: string, recipeId: string): Promise<void> {
    const result = await this.favoriteModel
      .findOneAndDelete({ userId, recipeId })
      .exec();

    if (!result) {
      throw new NotFoundException('Favorite not found');
    }
  }

  async getUserFavorites(userId: string): Promise<FavoriteRecipeResponseDto[]> {
    const favorites = await this.favoriteModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Fetch all recipes in parallel
    const recipeIds = favorites.map(fav => fav.recipeId);
    const recipes = await this.recipeModel
      .find({ _id: { $in: recipeIds } })
      .lean()
      .exec();

    // Create a map of recipeId to recipe for quick lookup
    const recipeMap = new Map(
      recipes.map(recipe => [recipe._id.toString(), recipe])
    );

    // Combine favorites with their recipes
    return favorites
      .map(favorite => {
        const recipe = recipeMap.get(favorite.recipeId);
        if (!recipe) return null;

        return {
          favoriteId: favorite._id.toString(),
          recipe,
          createdAt: favorite.createdAt,
        };
      })
      .filter(item => item !== null);
  }

  async isFavorite(userId: string, recipeId: string): Promise<boolean> {
    const favorite = await this.favoriteModel
      .findOne({ userId, recipeId })
      .lean()
      .exec();

    return !!favorite;
  }

  async getFavoriteCount(recipeId: string): Promise<number> {
    return this.favoriteModel.countDocuments({ recipeId }).exec();
  }
}
