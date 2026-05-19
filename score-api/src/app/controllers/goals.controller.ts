import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GoalsService } from '../service/goals.service';
import { UpdateGoalsDto } from '../dto/goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('current')
  async getCurrentGoals(@Request() req: any) {
    return this.goalsService.getCurrentGoals(req.user.userId);
  }

  @Post('current')
  async updateCurrentGoals(@Request() req: any, @Body() goalsData: UpdateGoalsDto) {
    return this.goalsService.updateCurrentGoals(req.user.userId, goalsData);
  }
}