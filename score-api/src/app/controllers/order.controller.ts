import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OrderService } from '../service/order.service';
import { CreateOrderDto, OrderResponseDto } from '../dto/order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Request() req,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<{ message: string; orderId: string }> {
    return this.orderService.createOrder(req.user.userId, createOrderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrders(@Request() req): Promise<OrderResponseDto[]> {
    return this.orderService.getOrders(req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(
    @Request() req,
    @Param('id') id: string,
  ): Promise<OrderResponseDto> {
    return this.orderService.getOrderById(req.user.userId, id);
  }
}
