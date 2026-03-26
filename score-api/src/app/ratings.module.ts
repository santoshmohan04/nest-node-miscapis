import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingsController } from './controllers/ratings.controller';
import { RatingsService } from './service/ratings.service';
import { Rating, RatingSchema } from './schema/rating.schema';
import { Recipe, RecipeSchema } from './schema/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Rating.name, schema: RatingSchema },
        { name: Recipe.name, schema: RecipeSchema },
      ],
      'recipes'
    ),
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService],
})
export class RatingsModule {}
