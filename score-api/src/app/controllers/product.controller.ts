import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto, ProductsResponseDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts(): Promise<ProductsResponseDto> {
    return this.productService.getAllProducts();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() productDto: ProductDto): Promise<ProductDto> {
    return this.productService.createProduct(productDto);
  }
}
