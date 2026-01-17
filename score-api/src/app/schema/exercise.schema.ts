import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AvailableExerciseDocument = AvailableExercise & Document;
export type FinishedExerciseDocument = FinishedExercise & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'availableExercises',
})
export class AvailableExercise {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  calories: number;
}

export const AvailableExerciseSchema = SchemaFactory.createForClass(AvailableExercise);

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'finishedExercises',
})
export class FinishedExercise {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  calories: number;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: ['completed', 'cancelled'] })
  state: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const FinishedExerciseSchema = SchemaFactory.createForClass(FinishedExercise);
