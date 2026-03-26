import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  recipeId: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// Create compound index to ensure a user can only rate a recipe once
RatingSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// Create indexes for efficient querying
RatingSchema.index({ recipeId: 1 });
RatingSchema.index({ userId: 1 });
