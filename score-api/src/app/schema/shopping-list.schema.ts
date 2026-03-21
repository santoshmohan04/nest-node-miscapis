import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShoppingListDocument = ShoppingList & Document;

@Schema({ timestamps: true })
export class ShoppingList {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ default: false })
  checked: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ShoppingListSchema = SchemaFactory.createForClass(ShoppingList);

// Create indexes for efficient querying
ShoppingListSchema.index({ userId: 1, createdAt: -1 });
ShoppingListSchema.index({ userId: 1, checked: 1 });
