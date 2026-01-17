import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesController } from './controllers/exercises.controller';
import { ExercisesService } from './service/exercises.service';
import {
  AvailableExercise,
  AvailableExerciseSchema,
  FinishedExercise,
  FinishedExerciseSchema,
} from './schema/exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AvailableExercise.name, schema: AvailableExerciseSchema },
      { name: FinishedExercise.name, schema: FinishedExerciseSchema },
    ]),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
