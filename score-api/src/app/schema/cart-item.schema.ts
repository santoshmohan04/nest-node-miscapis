import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema()
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
