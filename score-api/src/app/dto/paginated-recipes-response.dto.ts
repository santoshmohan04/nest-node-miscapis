import { Recipe } from '../schema/recipe.schema';

export class PaginatedRecipesResponseDto {
  data: Recipe[];
  page: number;
  totalPages: number;
  totalItems: number;
}
