import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShoppingList, ShoppingListDocument } from '../schema/shopping-list.schema';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from '../dto/update-shopping-list.dto';
import { ShoppingListResponseDto } from '../dto/shopping-list-response.dto';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectModel(ShoppingList.name, 'estore') 
    private shoppingListModel: Model<ShoppingListDocument>,
  ) {}

  async create(
    userId: string,
    createShoppingListDto: CreateShoppingListDto,
  ): Promise<ShoppingList> {
    const shoppingItem = new this.shoppingListModel({
      userId,
      ...createShoppingListDto,
    });
    
    return shoppingItem.save();
  }

  async findAllByUser(userId: string): Promise<ShoppingListResponseDto[]> {
    const items = await this.shoppingListModel
      .find({ userId })
      .sort({ checked: 1, createdAt: -1 }) // Unchecked items first, then by newest
      .lean()
      .exec();

    return items.map(item => ({
      id: item._id.toString(),
      userId: item.userId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      checked: item.checked,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  }

  async update(
    itemId: string,
    userId: string,
    updateShoppingListDto: UpdateShoppingListDto,
  ): Promise<ShoppingList> {
    const item = await this.shoppingListModel.findById(itemId).exec();

    if (!item) {
      throw new NotFoundException(`Shopping list item with ID "${itemId}" not found`);
    }

    // Ensure the item belongs to the user
    if (item.userId !== userId) {
      throw new ForbiddenException('You can only update your own shopping list items');
    }

    Object.assign(item, updateShoppingListDto);
    return item.save();
  }

  async delete(itemId: string, userId: string): Promise<void> {
    const item = await this.shoppingListModel.findById(itemId).exec();

    if (!item) {
      throw new NotFoundException(`Shopping list item with ID "${itemId}" not found`);
    }

    // Ensure the item belongs to the user
    if (item.userId !== userId) {
      throw new ForbiddenException('You can only delete your own shopping list items');
    }

    await this.shoppingListModel.findByIdAndDelete(itemId).exec();
  }

  async getStats(userId: string): Promise<{ total: number; checked: number; unchecked: number }> {
    const [total, checked] = await Promise.all([
      this.shoppingListModel.countDocuments({ userId }).exec(),
      this.shoppingListModel.countDocuments({ userId, checked: true }).exec(),
    ]);

    return {
      total,
      checked,
      unchecked: total - checked,
    };
  }

  async clearChecked(userId: string): Promise<{ deletedCount: number }> {
    const result = await this.shoppingListModel.deleteMany({ userId, checked: true }).exec();
    return { deletedCount: result.deletedCount || 0 };
  }
}
