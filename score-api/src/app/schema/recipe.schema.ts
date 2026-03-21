import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecipeDocument = Recipe & Document;

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Schema({ _id: false })
export class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);

@Schema({ timestamps: true })
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  cookingTime: number; // in minutes

  @Prop({ required: true })
  servings: number;

  @Prop({ required: true, enum: Difficulty, default: Difficulty.EASY })
  difficulty: Difficulty;

  @Prop({ type: [IngredientSchema], required: true })
  ingredients: Ingredient[];

  @Prop({ type: [String], required: true })
  instructions: string[];

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

// Create indexes for query optimization
RecipeSchema.index({ title: 'text', description: 'text' });
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ difficulty: 1 });
RecipeSchema.index({ authorId: 1 });
RecipeSchema.index({ createdAt: -1 });
