import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CartService } from '../service/cart.service';
import { AddToCartDto, CartItemResponseDto } from '../dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCart(@Request() req): Promise<CartItemResponseDto[]> {
    return this.cartService.getCartItems(req.user.userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Request() req,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<{ message: string; cartItemId: string }> {
    return this.cartService.addToCart(req.user.userId, addToCartDto);
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
