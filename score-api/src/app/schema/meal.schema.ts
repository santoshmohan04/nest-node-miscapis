import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MealDocument = Meal & Document;

@Schema({ timestamps: true })
export class Meal {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  instructions: string;

  @Prop({ required: true })
  creator: string;

  @Prop({ required: true })
  creator_email: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);

MealSchema.index({ slug: 1 });
