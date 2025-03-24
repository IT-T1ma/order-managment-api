import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productModel.findOne({
      name: data.name,
    });

    if (existingProduct) {
      throw new ConflictException('Product with this name already exists!');
    }
    return this.productModel.create(data);
  }

  async getAll(): Promise<Product[]> {
    return await this.productModel.find();
  }

  async delete(id: string) {
    const result = await this.productModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found!`);
    }
    return { message: `Product with id ${id} deleted!` };
  }
}
