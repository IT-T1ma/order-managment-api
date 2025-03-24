import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MongoIdDto } from '../../common/dto/mongo-id.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  getAll() {
    return this.productsService.getAll();
  }

  @Delete(':id')
  delete(@Param() { id }: MongoIdDto) {
    return this.productsService.delete(id);
  }
}
