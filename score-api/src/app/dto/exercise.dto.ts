import { IsNotEmpty, IsString, IsNumber, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFinishedExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  calories: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @IsEnum(['completed', 'cancelled'])
  @IsNotEmpty()
  state: 'completed' | 'cancelled';
}

export class ExerciseResponseDto {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date?: Date;
  state?: 'completed' | 'cancelled';
}

export class FinishedExerciseResponseDto extends ExerciseResponseDto {
  userId: string;
  date: Date;
  state: 'completed' | 'cancelled';
}
