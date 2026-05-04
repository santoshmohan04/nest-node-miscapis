import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { MealsService } from '../service/meals.service';
import { CreateMealDto } from '../dto/create-meal.dto';
import { Meal } from '../schema/meal.schema';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Meal[]> {
    return this.mealsService.findAll();
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('slug') slug: string): Promise<Meal> {
    return this.mealsService.findBySlug(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createMealDto: CreateMealDto,
  ): Promise<Meal> {
    return this.mealsService.create(createMealDto);
  }
}
