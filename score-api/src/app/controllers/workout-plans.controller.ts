import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkoutPlansService } from '../service/workout-plans.service';
import { CreateWorkoutPlanDto, UpdateWorkoutPlanDto } from '../dto/workout-plan.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('workout-plans')
export class WorkoutPlansController {
  constructor(private readonly workoutPlansService: WorkoutPlansService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async listWorkoutPlans(@Request() req) {
    return this.workoutPlansService.listWorkoutPlans(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createWorkoutPlan(@Request() req, @Body() createDto: CreateWorkoutPlanDto) {
    return this.workoutPlansService.createWorkoutPlan(req.user.userId, createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateWorkoutPlan(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateWorkoutPlanDto,
  ) {
    return this.workoutPlansService.updateWorkoutPlan(id, req.user.userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteWorkoutPlan(@Request() req, @Param('id') id: string) {
    await this.workoutPlansService.deleteWorkoutPlan(id, req.user.userId);
    return { message: 'Workout plan deleted successfully' };
  }
}
