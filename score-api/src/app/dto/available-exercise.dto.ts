import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateAvailableExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  calories: number;

  @IsOptional()
  @IsEnum(['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Other'])
  category?: string;

  @IsOptional()
  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficulty?: string;
}
