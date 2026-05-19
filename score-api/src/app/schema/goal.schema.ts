import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'goals',
})
export class Goal {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  weekStart: Date;

  @Prop({ default: null })
  targetSessions: number | null;

  @Prop({ default: null })
  targetCalories: number | null;

  @Prop({ default: null })
  targetMinutes: number | null;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
