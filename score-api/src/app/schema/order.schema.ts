import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export class OrderItem {
  productId: string;
  quantity: number;
  price: string;
  name: string;
  image: string;
}

@Schema()
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Object], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ default: 'pending' })
  status: string; // e.g., 'pending', 'confirmed', 'shipped', 'delivered'
}

export const OrderSchema = SchemaFactory.createForClass(Order);
