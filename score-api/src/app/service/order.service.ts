import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../schema/order.schema';
import { CreateOrderDto, OrderResponseDto, PreviewOrderDto, OrderPreviewResponseDto } from '../dto/order.dto';
import { CartService } from './cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name, 'estore') private orderModel: Model<OrderDocument>,
    private cartService: CartService,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<{ message: string; orderId: string }> {
    const newOrder = new this.orderModel({
      userId: new Types.ObjectId(userId),
      items: createOrderDto.items,
      total: createOrderDto.total,
      date: new Date(),
      status: 'pending',
    });

    await newOrder.save();

    // Clear the user's cart after successful order
    await this.cartService.clearCart(userId);

    return {
      message: 'Order placed successfully',
      orderId: newOrder._id.toString(),
    };
  }

  async getOrders(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .exec();

    return orders.map((order) => ({
      id: order._id.toString(),
      items: order.items,
      total: order.total,
      date: order.date,
      status: order.status,
    }));
  }

  async getOrderById(
    userId: string,
    orderId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order._id.toString(),
      items: order.items,
      total: order.total,
      date: order.date,
      status: order.status,
    };
  }

  async previewOrder(previewOrderDto: PreviewOrderDto): Promise<OrderPreviewResponseDto> {
    const items = previewOrderDto.items;

    // Calculate subtotal
    let subTotal = 0;
    items.forEach((item) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      subTotal += itemTotal;
    });

    // Calculate tax and delivery
    const tax = subTotal * 0.18; // 18% tax
    const delivery = subTotal > 0 ? 50 : 0; // Flat delivery fee
    const grandTotal = subTotal + tax + delivery;

    return {
      items,
      subTotal: Math.round(subTotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      delivery,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  }
}
