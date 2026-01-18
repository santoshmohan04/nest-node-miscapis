import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CartService } from '../service/cart.service';
import { AddToCartDto, CartItemResponseDto, UpdateCartItemDto, CartSummaryDto } from '../dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCart(@Request() req): Promise<CartItemResponseDto[]> {
    return this.cartService.getCartItems(req.user.userId);
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getCartSummary(@Request() req): Promise<CartSummaryDto> {
    return this.cartService.getCartSummary(req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Request() req,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<{ message: string; cartItemId: string }> {
    return this.cartService.addToCart(req.user.userId, addToCartDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCartItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<{ message: string }> {
    return this.cartService.updateCartItem(req.user.userId, id, updateCartItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeCartItem(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.cartService.removeCartItem(req.user.userId, id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearCart(@Request() req): Promise<{ message: string }> {
    return this.cartService.clearCart(req.user.userId);
  }
}
