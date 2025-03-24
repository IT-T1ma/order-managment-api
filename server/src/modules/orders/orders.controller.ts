import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { MongoIdDto } from '../../common/dto/mongo-id.dto';
import { isMongoDbId } from '../../common/utils/mongo-id.util';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  getAll() {
    return this.ordersService.getAll();
  }

  @Get(':userId')
  getOrdersByUser(@Param('userId') userId: string) {
    if (!isMongoDbId(userId)) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }
    return this.ordersService.getOrdersByUser(userId);
  }

  @Delete(':id')
  remove(@Param() { id }: MongoIdDto) {
    return this.ordersService.delete(id);
  }
}
