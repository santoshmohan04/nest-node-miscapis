import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema({ timestamps: true })
export class Goal {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true })
  userId!: Types.ObjectId;

  @Prop({ default: 2000 })
  dailyCalories!: number;

  @Prop({ default: 30 })
  dailyExerciseMinutes!: number;

  @Prop()
  targetWeight?: number;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);