import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal, GoalDocument } from '../schema/goal.schema';
import { UpdateGoalsDto } from '../dto/goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
  ) {}

  async getCurrentGoals(userId: string) {
    let goals = await this.goalModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    
    // Return default goals if the user hasn't set any yet
    if (!goals) {
      goals = new this.goalModel({ userId: new Types.ObjectId(userId) });
    }

    return {
      message: 'Current goals retrieved successfully',
      goals,
    };
  }

  async updateCurrentGoals(userId: string, goalsData: UpdateGoalsDto) {
    // upsert: true will create the document if it doesn't exist, or update it if it does
    const goals = await this.goalModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $set: goalsData },
      { new: true, upsert: true }
    ).exec();

    return {
      message: 'Current goals updated successfully',
      goals,
    };
  }
}