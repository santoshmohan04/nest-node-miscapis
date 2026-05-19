import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkoutPlan, WorkoutPlanDocument } from '../schema/workout-plan.schema';
import {
  CreateWorkoutPlanDto,
  UpdateWorkoutPlanDto,
  WorkoutPlanResponseDto,
} from '../dto/workout-plan.dto';

@Injectable()
export class WorkoutPlansService {
  constructor(
    @InjectModel(WorkoutPlan.name) private workoutPlanModel: Model<WorkoutPlanDocument>,
  ) {}

  private toResponse(plan: WorkoutPlanDocument): WorkoutPlanResponseDto {
    return {
      id: plan._id.toString(),
      userId: plan.userId.toString(),
      name: plan.name,
      exerciseIds: plan.exerciseIds.map((id) => id.toString()),
      isTemplate: plan.isTemplate,
      createdAt: (plan as any).createdAt,
      updatedAt: (plan as any).updatedAt,
    };
  }

  async listWorkoutPlans(userId: string): Promise<WorkoutPlanResponseDto[]> {
    const plans = await this.workoutPlanModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    return plans.map((p) => this.toResponse(p));
  }

  async createWorkoutPlan(
    userId: string,
    createDto: CreateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    const plan = new this.workoutPlanModel({
      userId: new Types.ObjectId(userId),
      name: createDto.name,
      exerciseIds: createDto.exerciseIds.map((id) => new Types.ObjectId(id)),
      isTemplate: createDto.isTemplate ?? false,
    });
    const saved = await plan.save();
    return this.toResponse(saved);
  }

  async updateWorkoutPlan(
    planId: string,
    userId: string,
    updateDto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlanResponseDto> {
    const updateData: Partial<WorkoutPlan> = {};
    if (updateDto.name !== undefined) updateData.name = updateDto.name;
    if (updateDto.isTemplate !== undefined) updateData.isTemplate = updateDto.isTemplate;
    if (updateDto.exerciseIds !== undefined) {
      updateData.exerciseIds = updateDto.exerciseIds.map((id) => new Types.ObjectId(id));
    }

    const plan = await this.workoutPlanModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(planId), userId: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true },
      )
      .exec();

    if (!plan) {
      throw new NotFoundException('Workout plan not found');
    }

    return this.toResponse(plan);
  }

  async deleteWorkoutPlan(planId: string, userId: string): Promise<void> {
    const result = await this.workoutPlanModel
      .findOneAndDelete({
        _id: new Types.ObjectId(planId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!result) {
      throw new NotFoundException('Workout plan not found');
    }
  }
}
