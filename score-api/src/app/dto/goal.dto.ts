import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateGoalDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  targetSessions?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  targetCalories?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  targetMinutes?: number;
}

export class GoalResponseDto {
  id: string;
  userId: string;
  weekStart: Date;
  targetSessions: number | null;
  targetCalories: number | null;
  targetMinutes: number | null;
}

export class GoalProgressDto extends GoalResponseDto {
  progress: {
    sessions: number;
    calories: number;
    minutes: number;
  };
}
