import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CartItem, CartItemDocument } from '../schema/cart-item.schema';
import { Product, ProductDocument } from '../schema/product.schema';
import { AddToCartDto, CartItemResponseDto } from '../dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(CartItem.name, 'estore') private cartItemModel: Model<CartItemDocument>,
    @InjectModel(Product.name, 'estore') private productModel: Model<ProductDocument>,
  ) {}

  async getCartItems(userId: string): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartItemModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('productId')
      .exec();

    return cartItems.map((item) => {
      const product = item.productId as any;
      return {
        id: item._id.toString(),
        productId: product._id.toString(),
        quantity: item.quantity,
        userId: item.userId.toString(),
        product: {
          id: product._id.toString(),
          name: product.name,
          image: product.image,
          price: product.price,
          title: product.title,
          category: product.category,
        },
      };
    });
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<{ message: string; cartItemId: string }> {
    const { productId, quantity } = addToCartDto;

    // Verify product exists
    const productExists = await this.productModel.findById(productId);
    if (!productExists) {
      throw new NotFoundException('Product not found');
    }

    // Check if item already exists in cart
    const existingCartItem = await this.cartItemModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return {
        message: 'Cart item updated successfully',
        cartItemId: existingCartItem._id.toString(),
      };
    } else {
      // Create new cart item
      const newCartItem = new this.cartItemModel({
        userId: new Types.ObjectId(userId),
        productId: new Types.ObjectId(productId),
        quantity,
      });
      await newCartItem.save();
      return {
        message: 'Item added to cart successfully',
        cartItemId: newCartItem._id.toString(),
      };
    }
  }

  async removeCartItem(
    userId: string,
    cartItemId: string,
  ): Promise<{ message: string }> {
    const result = await this.cartItemModel.findOneAndDelete({
      _id: new Types.ObjectId(cartItemId),
      userId: new Types.ObjectId(userId),
    });

    if (!result) {
      throw new NotFoundException('Cart item not found');
    }

    return { message: 'Cart item removed successfully' };
  }

  async clearCart(userId: string): Promise<{ message: string }> {
    await this.cartItemModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });

    return { message: 'Cart cleared successfully' };
  }
}
