import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesController } from './controllers/recipes.controller';
import { RecipesService } from './service/recipes.service';
import { Recipe, RecipeSchema } from './schema/recipe.schema';
import { RatingsModule } from './ratings.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Recipe.name, schema: RecipeSchema }],
      'recipes'
    ),
    RatingsModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
