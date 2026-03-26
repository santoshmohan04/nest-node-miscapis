import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { RatingsService } from '../service/ratings.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { Rating } from '../schema/rating.schema';
import { RecipeRatingsResponseDto } from '../dto/rating-response.dto';

@Controller('recipes')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':id/rate')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async rateRecipe(
    @Param('id') recipeId: string,
    @Body(ValidationPipe) createRatingDto: CreateRatingDto,
    @Request() req,
  ): Promise<Rating> {
    return this.ratingsService.createOrUpdateRating(
      req.user.userId,
      recipeId,
      createRatingDto,
    );
  }

  @Get(':id/ratings')
  @HttpCode(HttpStatus.OK)
  async getRecipeRatings(
    @Param('id') recipeId: string,
  ): Promise<RecipeRatingsResponseDto> {
    return this.ratingsService.getRecipeRatings(recipeId);
  }
}
