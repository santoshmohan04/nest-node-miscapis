import { Recipe } from '../schema/recipe.schema';

export class FavoriteRecipeResponseDto {
  favoriteId: string;
  recipe: Recipe;
  createdAt: Date;
}
