import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from '../service/comments.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schema/comment.schema';
import { RecipeCommentsResponseDto } from '../dto/comment-response.dto';

@Controller('api')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('recipes/:id/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') recipeId: string,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    return this.commentsService.createComment(
      req.user.userId,
      recipeId,
      createCommentDto,
    );
  }

  @Get('recipes/:id/comments')
  @HttpCode(HttpStatus.OK)
  async getRecipeComments(
    @Param('id') recipeId: string,
  ): Promise<RecipeCommentsResponseDto> {
    return this.commentsService.getRecipeComments(recipeId);
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') commentId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.commentsService.deleteComment(commentId, req.user.userId);
    return { message: 'Comment deleted successfully' };
  }
}
