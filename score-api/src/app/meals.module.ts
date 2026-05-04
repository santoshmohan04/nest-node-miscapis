import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealsController } from './controllers/meals.controller';
import { MealsService } from './service/meals.service';
import { Meal, MealSchema } from './schema/meal.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Meal.name, schema: MealSchema }],
      'meals'
    ),
  ],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
