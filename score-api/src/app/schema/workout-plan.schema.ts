import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkoutPlanDocument = WorkoutPlan & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'workoutPlans',
})
export class WorkoutPlan {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'AvailableExercise' }], default: [] })
  exerciseIds: Types.ObjectId[];

  @Prop({ default: false })
  isTemplate: boolean;
}

export const WorkoutPlanSchema = SchemaFactory.createForClass(WorkoutPlan);
