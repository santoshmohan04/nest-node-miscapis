import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AvailableExercise,
  AvailableExerciseDocument,
  FinishedExercise,
  FinishedExerciseDocument,
} from '../schema/exercise.schema';
import {
  CreateFinishedExerciseDto,
  ExerciseResponseDto,
  FinishedExerciseResponseDto,
} from '../dto/exercise.dto';
import { CreateAvailableExerciseDto } from '../dto/available-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(AvailableExercise.name)
    private availableExerciseModel: Model<AvailableExerciseDocument>,
    @InjectModel(FinishedExercise.name)
    private finishedExerciseModel: Model<FinishedExerciseDocument>,
  ) {}

  async getAvailableExercises(): Promise<ExerciseResponseDto[]> {
    const exercises = await this.availableExerciseModel.find().exec();
    return exercises.map((exercise) => ({
      id: exercise._id.toString(),
      name: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
    }));
  }

  async createAvailableExercise(
    createAvailableExerciseDto: CreateAvailableExerciseDto,
  ): Promise<ExerciseResponseDto> {
    const exercise = new this.availableExerciseModel(
      createAvailableExerciseDto,
    );
    const savedExercise = await exercise.save();

    return {
      id: savedExercise._id.toString(),
      name: savedExercise.name,
      duration: savedExercise.duration,
      calories: savedExercise.calories,
    };
  }

  async addFinishedExercise(
    userId: string,
    createFinishedExerciseDto: CreateFinishedExerciseDto,
  ): Promise<FinishedExerciseResponseDto> {
    const finishedExercise = new this.finishedExerciseModel({
      ...createFinishedExerciseDto,
      userId: new Types.ObjectId(userId),
    });

    const savedExercise = await finishedExercise.save();

    return {
      id: savedExercise._id.toString(),
      name: savedExercise.name,
      duration: savedExercise.duration,
      calories: savedExercise.calories,
      date: savedExercise.date,
      state: savedExercise.state as 'completed' | 'cancelled',
      userId: savedExercise.userId.toString(),
    };
  }

  async getFinishedExercises(userId: string): Promise<FinishedExerciseResponseDto[]> {
    const exercises = await this.finishedExerciseModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .exec();

    return exercises.map((exercise) => ({
      id: exercise._id.toString(),
      name: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
      date: exercise.date,
      state: exercise.state as 'completed' | 'cancelled',
      userId: exercise.userId.toString(),
    }));
  }
}
