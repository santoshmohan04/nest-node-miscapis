import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal, MealDocument } from '../schema/meal.schema';
import { CreateMealDto } from '../dto/create-meal.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectModel(Meal.name, 'meals') private mealModel: Model<MealDocument>,
  ) {}

  async findAll(): Promise<Meal[]> {
    return this.mealModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async findBySlug(slug: string): Promise<Meal> {
    const meal = await this.mealModel.findOne({ slug }).lean().exec();
    if (!meal) {
      throw new NotFoundException(`Meal with slug "${slug}" not found`);
    }
    return meal;
  }

  async create(createMealDto: CreateMealDto): Promise<Meal> {
    const slug = createMealDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const meal = new this.mealModel({
      title: createMealDto.title,
      slug,
      image: createMealDto.image,
      summary: createMealDto.summary,
      instructions: createMealDto.instructions,
      creator: createMealDto.name,
      creator_email: createMealDto.email,
    });

    return meal.save();
  }
}
