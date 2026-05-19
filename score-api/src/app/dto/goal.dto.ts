import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGoalsDto {
  @IsOptional()
  @IsNumber()
  dailyCalories?: number;

  @IsOptional()
  @IsNumber()
  dailyExerciseMinutes?: number;

  @IsOptional()
  @IsNumber()
  targetWeight?: number;
}