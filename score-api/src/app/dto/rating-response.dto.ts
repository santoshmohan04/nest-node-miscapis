export class RatingResponseDto {
  id: string;
  rating: number;
  recipeId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeRatingsResponseDto {
  averageRating: number;
  totalRatings: number;
  ratings: RatingResponseDto[];
}
