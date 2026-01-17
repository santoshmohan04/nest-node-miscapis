import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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
}
