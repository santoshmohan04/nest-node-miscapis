import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ProductDto {
  id?: string; // MongoDB _id

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}

export class ProductsResponseDto {
  cameras: ProductDto[];
  products: ProductDto[];
  shirts: ProductDto[];
  smartphones: ProductDto[];
  watches: ProductDto[];
}
