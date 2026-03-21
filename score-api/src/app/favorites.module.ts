import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './service/favorites.service';
import { Favorite, FavoriteSchema } from './schema/favorite.schema';
import { Recipe, RecipeSchema } from './schema/recipe.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Favorite.name, schema: FavoriteSchema },
        { name: Recipe.name, schema: RecipeSchema },
      ],
      'estore'
    ),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
