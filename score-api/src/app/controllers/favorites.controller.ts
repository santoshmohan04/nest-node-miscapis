import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FavoritesService } from '../service/favorites.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Favorite } from '../schema/favorite.schema';
import { FavoriteRecipeResponseDto } from '../dto/favorite-recipe-response.dto';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('recipes/:id/favorite')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @Param('id') recipeId: string,
    @Request() req,
  ): Promise<Favorite> {
    return this.favoritesService.addFavorite(req.user.userId, recipeId);
  }

  @Delete('recipes/:id/favorite')
  @HttpCode(HttpStatus.OK)
  async removeFavorite(
    @Param('id') recipeId: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.favoritesService.removeFavorite(req.user.userId, recipeId);
    return { message: 'Recipe removed from favorites' };
  }

  @Get('users/me/favorites')
  @HttpCode(HttpStatus.OK)
  async getUserFavorites(
    @Request() req,
  ): Promise<FavoriteRecipeResponseDto[]> {
    return this.favoritesService.getUserFavorites(req.user.userId);
  }
}
