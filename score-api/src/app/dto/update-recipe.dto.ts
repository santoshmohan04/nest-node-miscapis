import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
  ArrayMinSize,
  Min,
  IsUrl,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Difficulty } from '../schema/recipe.schema';
import { IngredientDto } from './ingredient.dto';

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  cookingTime?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  servings?: number;

  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  instructions?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  authorId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;
}
