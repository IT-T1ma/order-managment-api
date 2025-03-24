import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  private hasSufficientBalance(balance: number, totalPrice: number): boolean {
    return balance >= totalPrice;
  }

  private isStockAvailable(stock: number, quantity: number): boolean {
    return stock >= quantity;
  }

  private calculateTotalPrice(quantity: number, price: number): number {
    return quantity * price;
  }

  async create(data: CreateOrderDto): Promise<Order> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(data.userId).session(session);
      const product = await this.productModel
        .findById(data.productId)
        .session(session);

      if (!user) {
        throw new NotFoundException(`User with ID ${data.userId} not found`);
      }
      if (!product)
        throw new NotFoundException(
          `Product with ID ${data.productId} not found`,
        );

      const totalPrice = this.calculateTotalPrice(data.quantity, product.price);

      if (!this.isStockAvailable(product.stock, data.quantity)) {
        throw new BadRequestException('Not enough stock');
      }

      if (!this.hasSufficientBalance(user.balance, totalPrice)) {
        throw new BadRequestException('Insufficient balance');
      }

      product.stock -= data.quantity;
      user.balance -= totalPrice;

      await product.save({ session });
      await user.save({ session });

      const order = new this.orderModel({ ...data, totalPrice });
      await order.save({ session });

      await session.commitTransaction();

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async getAll(): Promise<Order[]> {
    return await this.orderModel.find();
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return await this.orderModel.find({ userId });
  }

  async delete(id: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const order = await this.orderModel.findById(id).session(session);

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      const { _id, productId, userId, quantity, totalPrice } = order;

      const product = await this.productModel
        .findById(productId)
        .session(session);
      const user = await this.userModel.findById(userId).session(session);

      if (!product || !user) {
        throw new NotFoundException(`Product or User for this order not found`);
      }
      product.stock += quantity;
      user.balance += totalPrice;

      await product.save({ session });
      await user.save({ session });

      await this.orderModel.findByIdAndDelete(_id);
      Logger.log(
        `The order with ID ${_id.toString()} has been deleted successfully.`,
      );

      await session.commitTransaction();
      return `The order with ID ${_id.toString()} has been deleted, and the stock and balance have been updated.`;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
