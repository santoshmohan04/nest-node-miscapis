import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ProductDetailsDto {
  id: string;
  name: string;
  image: string;
  price: string;
  title: string;
  category: string;
}

export class CartItemResponseDto {
  id: string;
  productId: string;
  quantity: number;
  userId: string;
  product: ProductDetailsDto;
}

export class CartSummaryDto {
  itemsCount: number;
  subTotal: number;
  tax: number;
  delivery: number;
  grandTotal: number;
}
