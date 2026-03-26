import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FavoriteDocument = Favorite & Document;

@Schema({ timestamps: true })
export class Favorite {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  recipeId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

// Create compound index to ensure a user can only favorite a recipe once
FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

// Create indexes for efficient querying
FavoriteSchema.index({ userId: 1 });
FavoriteSchema.index({ recipeId: 1 });
