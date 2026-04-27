import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
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
  UpdateFinishedExerciseDto,
  ExerciseResponseDto,
  FinishedExerciseResponseDto,
  ExerciseStatsDto,
  ExerciseSummaryItemDto,
} from '../dto/exercise.dto';
import { CreateAvailableExerciseDto } from '../dto/available-exercise.dto';

const MS_PER_DAY = 86_400_000;
const ALLOWED_CATEGORIES = ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Other'];
const ALLOWED_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(AvailableExercise.name)
    private availableExerciseModel: Model<AvailableExerciseDocument>,
    @InjectModel(FinishedExercise.name)
    private finishedExerciseModel: Model<FinishedExerciseDocument>,
  ) {}

  async getAvailableExercises(
    category?: string,
    difficulty?: string,
    userId?: string,
  ): Promise<ExerciseResponseDto[]> {
    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      throw new BadRequestException(
        `Invalid category. Allowed values: ${ALLOWED_CATEGORIES.join(', ')}`,
      );
    }
    if (difficulty && !ALLOWED_DIFFICULTIES.includes(difficulty)) {
      throw new BadRequestException(
        `Invalid difficulty. Allowed values: ${ALLOWED_DIFFICULTIES.join(', ')}`,
      );
    }

    const filter: Record<string, unknown> = {
      $or: [{ userId: null }, { userId: { $exists: false } }],
    };

    if (userId) {
      filter.$or = [
        { userId: null },
        { userId: { $exists: false } },
        { userId: new Types.ObjectId(userId) },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const exercises = await this.availableExerciseModel.find(filter).exec();
    return exercises.map((exercise) => ({
      id: exercise._id.toString(),
      name: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
      category: exercise.category,
      difficulty: exercise.difficulty,
      userId: exercise.userId ? exercise.userId.toString() : null,
    }));
  }

  async createAvailableExercise(
    createAvailableExerciseDto: CreateAvailableExerciseDto,
    userId?: string,
  ): Promise<ExerciseResponseDto> {
    const exercise = new this.availableExerciseModel({
      ...createAvailableExerciseDto,
      userId: userId ? new Types.ObjectId(userId) : null,
    });
    const savedExercise = await exercise.save();

    return {
      id: savedExercise._id.toString(),
      name: savedExercise.name,
      duration: savedExercise.duration,
      calories: savedExercise.calories,
      category: savedExercise.category,
      difficulty: savedExercise.difficulty,
      userId: savedExercise.userId ? savedExercise.userId.toString() : null,
    };
  }

  async deleteAvailableExercise(exerciseId: string, userId: string): Promise<void> {
    const exercise = await this.availableExerciseModel.findById(exerciseId).exec();
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    if (!exercise.userId || exercise.userId.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own exercises');
    }
    await this.availableExerciseModel.findByIdAndDelete(exerciseId).exec();
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

  async updateFinishedExercise(
    exerciseId: string,
    userId: string,
    updateDto: UpdateFinishedExerciseDto,
  ): Promise<FinishedExerciseResponseDto> {
    const exercise = await this.finishedExerciseModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(exerciseId), userId: new Types.ObjectId(userId) },
        { $set: updateDto },
        { new: true },
      )
      .exec();

    if (!exercise) {
      throw new NotFoundException('Exercise record not found');
    }

    return {
      id: exercise._id.toString(),
      name: exercise.name,
      duration: exercise.duration,
      calories: exercise.calories,
      date: exercise.date,
      state: exercise.state as 'completed' | 'cancelled',
      userId: exercise.userId.toString(),
    };
  }

  async deleteFinishedExercise(exerciseId: string, userId: string): Promise<void> {
    const result = await this.finishedExerciseModel
      .findOneAndDelete({
        _id: new Types.ObjectId(exerciseId),
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (!result) {
      throw new NotFoundException('Exercise record not found');
    }
  }

  async getFinishedExerciseStats(userId: string): Promise<ExerciseStatsDto> {
    const exercises = await this.finishedExerciseModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .exec();

    const totalSessions = exercises.length;
    const totalCalories = exercises.reduce((sum, e) => sum + (e.calories || 0), 0);
    const totalDuration = exercises.reduce((sum, e) => sum + (e.duration || 0), 0);
    const completedCount = exercises.filter((e) => e.state === 'completed').length;
    const completionRate = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;

    // Calculate streak: consecutive days with at least one completed exercise
    const completedDates = exercises
      .filter((e) => e.state === 'completed')
      .map((e) => {
        const d = new Date(e.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      });

    const uniqueDates = [...new Set(completedDates)].sort((a, b) => b - a);
    let streakDays = 0;
    const today = new Date();
    const todayMs = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = todayMs - i * MS_PER_DAY;
      if (uniqueDates[i] === expected) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      totalSessions,
      totalCalories,
      totalDuration,
      streakDays,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  async getFinishedExercisesSummary(
    userId: string,
    groupBy: 'week' | 'month',
  ): Promise<ExerciseSummaryItemDto[]> {
    const exercises = await this.finishedExerciseModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: 1 })
      .exec();

    const grouped = new Map<string, ExerciseSummaryItemDto>();

    for (const exercise of exercises) {
      const date = new Date(exercise.date);
      let period: string;

      if (groupBy === 'month') {
        period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else {
        // Use Monday-based ISO week: find the Monday of the week containing this date
        const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(date);
        monday.setDate(date.getDate() - daysFromMonday);
        monday.setHours(0, 0, 0, 0);
        const year = monday.getFullYear();
        const jan4 = new Date(year, 0, 4); // Jan 4 is always in ISO week 1
        const weekNum = Math.round(
          ((monday.getTime() - jan4.getTime()) / MS_PER_DAY + jan4.getDay() + 6) / 7,
        );
        period = `${year}-W${String(weekNum).padStart(2, '0')}`;
      }

      if (!grouped.has(period)) {
        grouped.set(period, { period, totalSessions: 0, totalCalories: 0, totalDuration: 0 });
      }

      const entry = grouped.get(period)!;
      entry.totalSessions++;
      entry.totalCalories += exercise.calories || 0;
      entry.totalDuration += exercise.duration || 0;
    }

    return Array.from(grouped.values());
  }
}
