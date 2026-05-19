import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  exerciseIds: string[];

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;
}

export class UpdateWorkoutPlanDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exerciseIds?: string[];

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;
}

export class WorkoutPlanResponseDto {
  id: string;
  userId: string;
  name: string;
  exerciseIds: string[];
  isTemplate: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
