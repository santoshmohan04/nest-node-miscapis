import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRecipeCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}
