import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './controllers/goals.controller';
import { GoalsService } from './service/goals.service';
import { Goal, GoalSchema } from './schema/goal.schema';
import {
  FinishedExercise,
  FinishedExerciseSchema,
} from './schema/exercise.schema';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Goal.name, schema: GoalSchema },
      { name: FinishedExercise.name, schema: FinishedExerciseSchema },
    ]),
    AuthModule,
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
