import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './controllers/cart.controller';
import { CartService } from './service/cart.service';
import { CartItem, CartItemSchema } from './schema/cart-item.schema';
import { Product, ProductSchema } from './schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: CartItem.name, schema: CartItemSchema },
        { name: Product.name, schema: ProductSchema },
      ],
      'estore'
    ),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
