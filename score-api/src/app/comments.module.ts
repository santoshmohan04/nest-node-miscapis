import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './service/comments.service';
import { Comment, CommentSchema } from './schema/comment.schema';
import { Recipe, RecipeSchema } from './schema/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Comment.name, schema: CommentSchema },
        { name: Recipe.name, schema: RecipeSchema },
      ],
      'recipes'
    ),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
