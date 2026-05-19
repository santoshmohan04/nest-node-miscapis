import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkoutPlansController } from './controllers/workout-plans.controller';
import { WorkoutPlansService } from './service/workout-plans.service';
import { WorkoutPlan, WorkoutPlanSchema } from './schema/workout-plan.schema';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkoutPlan.name, schema: WorkoutPlanSchema }]),
    AuthModule,
  ],
  controllers: [WorkoutPlansController],
  providers: [WorkoutPlansService],
})
export class WorkoutPlansModule {}
