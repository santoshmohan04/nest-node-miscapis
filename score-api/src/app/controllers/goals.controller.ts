import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { GoalsService } from '../service/goals.service';
import { CreateGoalDto } from '../dto/goal.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async upsertGoal(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.upsertGoal(req.user.userId, createGoalDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async getCurrentGoal(@Request() req) {
    return this.goalsService.getCurrentGoal(req.user.userId);
  }
}
