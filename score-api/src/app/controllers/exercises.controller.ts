import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ExercisesService } from '../service/exercises.service';
import { CreateFinishedExerciseDto } from '../dto/exercise.dto';
import { CreateAvailableExerciseDto } from '../dto/available-exercise.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get('available')
  async getAvailableExercises() {
    return this.exercisesService.getAvailableExercises();
  }

  @Post('available')
  async createAvailableExercise(
    @Body() createAvailableExerciseDto: CreateAvailableExerciseDto,
  ) {
    return this.exercisesService.createAvailableExercise(
      createAvailableExerciseDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('finished')
  async addFinishedExercise(
    @Request() req,
    @Body() createFinishedExerciseDto: CreateFinishedExerciseDto,
  ) {
    return this.exercisesService.addFinishedExercise(
      req.user.userId,
      createFinishedExerciseDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('finished')
  async getFinishedExercises(@Request() req) {
    return this.exercisesService.getFinishedExercises(req.user.userId);
  }
}
