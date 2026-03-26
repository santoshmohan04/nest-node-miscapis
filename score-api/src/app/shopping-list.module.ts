import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingListController } from './controllers/shopping-list.controller';
import { ShoppingListService } from './service/shopping-list.service';
import { ShoppingList, ShoppingListSchema } from './schema/shopping-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ShoppingList.name, schema: ShoppingListSchema }],
      'recipes'
    ),
  ],
  controllers: [ShoppingListController],
  providers: [ShoppingListService],
  exports: [ShoppingListService],
})
export class ShoppingListModule {}
