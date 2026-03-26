import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeCategoryDocument = RecipeCategory & Document;

@Schema({ timestamps: true })
export class RecipeCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  icon: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RecipeCategorySchema = SchemaFactory.createForClass(RecipeCategory);

// Create index for name lookup
RecipeCategorySchema.index({ name: 1 });
