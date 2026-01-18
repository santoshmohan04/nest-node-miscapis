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
import { CreateOrderDto, OrderResponseDto, PreviewOrderDto, OrderPreviewResponseDto } from '../dto/order.dto';

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

  @Post('preview')
  @HttpCode(HttpStatus.OK)
  async previewOrder(
    @Body() previewOrderDto: PreviewOrderDto,
  ): Promise<OrderPreviewResponseDto> {
    return this.orderService.previewOrder(previewOrderDto);
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
