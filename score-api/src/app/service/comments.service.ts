import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../schema/comment.schema';
import { Recipe, RecipeDocument } from '../schema/recipe.schema';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentResponseDto, RecipeCommentsResponseDto } from '../dto/comment-response.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name, 'estore') 
    private commentModel: Model<CommentDocument>,
    @InjectModel(Recipe.name, 'estore')
    private recipeModel: Model<RecipeDocument>,
  ) {}

  async createComment(
    userId: string,
    recipeId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    // Check if recipe exists
    const recipe = await this.recipeModel.findById(recipeId).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
    }

    // Create comment
    const comment = new this.commentModel({
      userId,
      recipeId,
      text: createCommentDto.text,
    });
    
    return comment.save();
  }

  async getRecipeComments(recipeId: string): Promise<RecipeCommentsResponseDto> {
    // Check if recipe exists
    const recipe = await this.recipeModel.findById(recipeId).exec();
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID "${recipeId}" not found`);
    }

    // Get all comments for the recipe
    const comments = await this.commentModel
      .find({ recipeId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Map comments to response DTOs
    const commentResponses: CommentResponseDto[] = comments.map(comment => ({
      id: comment._id.toString(),
      recipeId: comment.recipeId,
      userId: comment.userId,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      totalComments: comments.length,
      comments: commentResponses,
    };
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentModel.findById(commentId).exec();
    
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${commentId}" not found`);
    }

    // Check if the user is the author of the comment
    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentModel.findByIdAndDelete(commentId).exec();
  }

  async getCommentsByRecipeIds(recipeIds: string[]): Promise<Map<string, number>> {
    const comments = await this.commentModel
      .find({ recipeId: { $in: recipeIds } })
      .select('recipeId')
      .lean()
      .exec();

    // Count comments per recipe
    const commentCounts = new Map<string, number>();
    
    comments.forEach(comment => {
      const count = commentCounts.get(comment.recipeId) || 0;
      commentCounts.set(comment.recipeId, count + 1);
    });

    return commentCounts;
  }

  async getCommentCount(recipeId: string): Promise<number> {
    return this.commentModel.countDocuments({ recipeId }).exec();
  }
}
