import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './service/order.service';
import { Order, OrderSchema } from './schema/order.schema';
import { CartModule } from './cart.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Order.name, schema: OrderSchema }],
      'estore'
    ),
    CartModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
