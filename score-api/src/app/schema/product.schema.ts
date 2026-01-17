import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string; // e.g., 'cameras', 'smartphones', 'watches', 'shirts', 'products'
}

export const ProductSchema = SchemaFactory.createForClass(Product);
