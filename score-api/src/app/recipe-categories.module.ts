import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeCategoriesController } from './controllers/recipe-categories.controller';
import { RecipeCategoriesService } from './service/recipe-categories.service';
import { RecipeCategory, RecipeCategorySchema } from './schema/recipe-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RecipeCategory.name, schema: RecipeCategorySchema }],
      'estore'
    ),
  ],
  controllers: [RecipeCategoriesController],
  providers: [RecipeCategoriesService],
  exports: [RecipeCategoriesService],
})
export class RecipeCategoriesModule {}
