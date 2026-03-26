import { Recipe } from '../schema/recipe.schema';

export class RecipeWithRatingDto extends Recipe {
  averageRating?: number;
  totalRatings?: number;
}

export class PaginatedRecipesWithRatingsResponseDto {
  data: RecipeWithRatingDto[];
  page: number;
  totalPages: number;
  totalItems: number;
}
