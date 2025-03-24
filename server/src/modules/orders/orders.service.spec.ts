/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Connection, Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order.schema';

jest.mock('../products/schemas/product.schema');
jest.mock('../users/schemas/user.schema');
jest.mock('./schemas/order.schema');
jest.mock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  Connection: jest.fn(),
}));

describe('OrdersService - Business Logic', () => {
  let service: OrdersService;
  let mockUserModel: jest.Mocked<Model<User>>;
  let mockProductModel: jest.Mocked<Model<Product>>;
  let mockOrderModel: jest.Mocked<Model<Order>>;
  let mockConnection: jest.Mocked<Connection>;

  beforeEach(() => {
    mockUserModel = { findById: jest.fn() } as any;
    mockProductModel = { findById: jest.fn() } as any;
    mockOrderModel = { create: jest.fn() } as any;
    mockConnection = { startSession: jest.fn() } as any;

    service = new OrdersService(
      mockOrderModel,
      mockUserModel,
      mockProductModel,
      mockConnection,
    );
  });

  it('should return true if balance is sufficient', () => {
    const balance = 100;
    const totalPrice = 50;
    expect(service['hasSufficientBalance'](balance, totalPrice)).toBe(true);
  });

  it('should return false if balance is insufficient', () => {
    const balance = 30;
    const totalPrice = 50;
    expect(service['hasSufficientBalance'](balance, totalPrice)).toBe(false);
  });

  it('should return true if stock is available', () => {
    const stock = 10;
    const quantity = 5;
    expect(service['isStockAvailable'](stock, quantity)).toBe(true);
  });

  it('should return false if stock is insufficient', () => {
    const stock = 3;
    const quantity = 5;
    expect(service['isStockAvailable'](stock, quantity)).toBe(false);
  });

  it('should calculate the correct total price', () => {
    const quantity = 2;
    const price = 10;
    expect(service['calculateTotalPrice'](quantity, price)).toBe(20);
  });

  it('should calculate the correct total price with different values', () => {
    const quantity = 5;
    const price = 15;
    expect(service['calculateTotalPrice'](quantity, price)).toBe(75);
  });
});
