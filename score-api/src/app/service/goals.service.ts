import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal, GoalDocument } from '../schema/goal.schema';
import {
  FinishedExercise,
  FinishedExerciseDocument,
} from '../schema/exercise.schema';
import { CreateGoalDto, GoalProgressDto } from '../dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    @InjectModel(FinishedExercise.name)
    private finishedExerciseModel: Model<FinishedExerciseDocument>,
  ) {}

  private getWeekStart(date = new Date()): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async upsertGoal(userId: string, createGoalDto: CreateGoalDto): Promise<GoalProgressDto> {
    const weekStart = this.getWeekStart();

    const goal = await this.goalModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId), weekStart },
        {
          $set: {
            userId: new Types.ObjectId(userId),
            weekStart,
            targetSessions: createGoalDto.targetSessions ?? null,
            targetCalories: createGoalDto.targetCalories ?? null,
            targetMinutes: createGoalDto.targetMinutes ?? null,
          },
        },
        { new: true, upsert: true },
      )
      .exec();

    return this.buildGoalProgress(goal, userId);
  }

  async getCurrentGoal(userId: string): Promise<GoalProgressDto> {
    const weekStart = this.getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const goal = await this.goalModel
      .findOne({ userId: new Types.ObjectId(userId), weekStart })
      .exec();

    if (!goal) {
      throw new NotFoundException('No goal set for the current week');
    }

    return this.buildGoalProgress(goal, userId);
  }

  private async buildGoalProgress(goal: GoalDocument, userId: string): Promise<GoalProgressDto> {
    const weekStart = this.getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const exercises = await this.finishedExerciseModel
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: weekStart, $lt: weekEnd },
        state: 'completed',
      })
      .exec();

    const sessions = exercises.length;
    const calories = exercises.reduce((sum, e) => sum + (e.calories || 0), 0);
    const minutes = exercises.reduce((sum, e) => sum + (e.duration || 0), 0);

    return {
      id: goal._id.toString(),
      userId: goal.userId.toString(),
      weekStart: goal.weekStart,
      targetSessions: goal.targetSessions,
      targetCalories: goal.targetCalories,
      targetMinutes: goal.targetMinutes,
      progress: { sessions, calories, minutes },
    };
  }
}
