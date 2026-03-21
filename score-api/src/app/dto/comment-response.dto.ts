export class CommentResponseDto {
  id: string;
  recipeId: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeCommentsResponseDto {
  totalComments: number;
  comments: CommentResponseDto[];
}
