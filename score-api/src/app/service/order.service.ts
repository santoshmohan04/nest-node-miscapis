import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from '../schema/order.schema';
import { CreateOrderDto, OrderResponseDto } from '../dto/order.dto';
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
}
