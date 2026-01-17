import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schema/product.schema';
import { ProductDto, ProductsResponseDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name, 'estore') private productModel: Model<ProductDocument>,
  ) {}

  async getAllProducts(): Promise<ProductsResponseDto> {
    const allProducts = await this.productModel.find().exec();

    const response: ProductsResponseDto = {
      cameras: [],
      products: [],
      shirts: [],
      smartphones: [],
      watches: [],
    };

    allProducts.forEach((product) => {
      const productDto: ProductDto = {
        id: product._id.toString(),
        name: product.name,
        image: product.image,
        price: product.price,
        title: product.title,
        category: product.category,
      };

      switch (product.category) {
        case 'cameras':
          response.cameras.push(productDto);
          break;
        case 'smartphones':
          response.smartphones.push(productDto);
          break;
        case 'watches':
          response.watches.push(productDto);
          break;
        case 'shirts':
          response.shirts.push(productDto);
          break;
        case 'products':
          response.products.push(productDto);
          break;
        default:
          response.products.push(productDto);
      }
    });

    return response;
  }

  async createProduct(productDto: ProductDto): Promise<Product> {
    const newProduct = new this.productModel(productDto);
    return newProduct.save();
  }

  async seedProducts(products: ProductDto[]): Promise<void> {
    await this.productModel.deleteMany({});
    await this.productModel.insertMany(products);
  }
}
