import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { ShoppingListService } from '../service/shopping-list.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateShoppingListDto } from '../dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from '../dto/update-shopping-list.dto';
import { ShoppingList } from '../schema/shopping-list.schema';
import { ShoppingListResponseDto } from '../dto/shopping-list-response.dto';

@Controller('api/shopping-list')
@UseGuards(JwtAuthGuard)
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createShoppingListDto: CreateShoppingListDto,
    @Request() req,
  ): Promise<ShoppingList> {
    return this.shoppingListService.create(req.user.userId, createShoppingListDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Request() req): Promise<ShoppingListResponseDto[]> {
    return this.shoppingListService.findAllByUser(req.user.userId);
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats(@Request() req): Promise<{ total: number; checked: number; unchecked: number }> {
    return this.shoppingListService.getStats(req.user.userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateShoppingListDto: UpdateShoppingListDto,
    @Request() req,
  ): Promise<ShoppingList> {
    return this.shoppingListService.update(id, req.user.userId, updateShoppingListDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
    @Request() req,
  ): Promise<{ message: string }> {
    await this.shoppingListService.delete(id, req.user.userId);
    return { message: 'Shopping list item deleted successfully' };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearChecked(@Request() req): Promise<{ message: string; deletedCount: number }> {
    const result = await this.shoppingListService.clearChecked(req.user.userId);
    return {
      message: 'Checked items cleared successfully',
      deletedCount: result.deletedCount,
    };
  }
}
