import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExercisesService } from '../service/exercises.service';
import { CreateFinishedExerciseDto, UpdateFinishedExerciseDto } from '../dto/exercise.dto';
import { CreateAvailableExerciseDto } from '../dto/available-exercise.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('available')
  async getAvailableExercises(
    @Request() req,
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.exercisesService.getAvailableExercises(category, difficulty, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('available')
  async createAvailableExercise(
    @Request() req,
    @Body() createAvailableExerciseDto: CreateAvailableExerciseDto,
  ) {
    return this.exercisesService.createAvailableExercise(
      createAvailableExerciseDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('available/:id')
  async deleteAvailableExercise(@Request() req, @Param('id') id: string) {
    await this.exercisesService.deleteAvailableExercise(id, req.user.userId);
    return { message: 'Exercise deleted successfully' };
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
  @Get('finished/stats')
  async getFinishedExerciseStats(@Request() req) {
    return this.exercisesService.getFinishedExerciseStats(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('finished/summary')
  async getFinishedExercisesSummary(
    @Request() req,
    @Query('groupBy') groupBy: 'week' | 'month' = 'week',
  ) {
    return this.exercisesService.getFinishedExercisesSummary(req.user.userId, groupBy);
  }

  @UseGuards(JwtAuthGuard)
  @Get('finished')
  async getFinishedExercises(@Request() req) {
    return this.exercisesService.getFinishedExercises(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('finished/:id')
  async updateFinishedExercise(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateFinishedExerciseDto,
  ) {
    return this.exercisesService.updateFinishedExercise(id, req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('finished/:id')
  async deleteFinishedExercise(@Request() req, @Param('id') id: string) {
    await this.exercisesService.deleteFinishedExercise(id, req.user.userId);
    return { message: 'Exercise record deleted successfully' };
  }
}
