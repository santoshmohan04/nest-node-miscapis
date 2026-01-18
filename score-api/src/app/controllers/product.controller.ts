import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
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

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchProducts(@Query('q') query: string): Promise<ProductDto[]> {
    if (!query) {
      return [];
    }
    return this.productService.searchProducts(query);
  }

  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  async getProductsByCategory(@Param('category') category: string): Promise<ProductDto[]> {
    return this.productService.getProductsByCategory(category);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') id: string): Promise<ProductDto> {
    try {
      return await this.productService.getProductById(id);
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() productDto: ProductDto): Promise<ProductDto> {
    return this.productService.createProduct(productDto);
  }
}
