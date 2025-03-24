import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../app.module';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should throw an error if balance is insufficient', async () => {
    const createOrderDto = {
      userId: '67da830eb198cc30ead62c6c',
      productId: '67d93bf0c96f8941774d1251',
      quantity: 2,
    };
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400);

    expect(response.body.message).toBe('Insufficient balance');
  });

  it('should throw an error if stock is insufficient', async () => {
    const createOrderDto = {
      userId: '67da830eb198cc30ead62c6c',
      productId: '67d93bf0c96f8941774d1251',
      quantity: 10,
    };
    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400);

    expect(response.body.message).toBe('Insufficient balance');
  });

  it('should return orders for a user (GET /orders/:userId)', async () => {
    const userId = '67da830eb198cc30ead62c6c';
    const response = await request(app.getHttpServer())
      .get(`/orders/${userId}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('should not create order if balance deduction fails', async () => {
    const createOrderDto = {
      userId: '67da830eb198cc30ead62c6c',
      productId: '67d93bf0c96f8941774d1251',
      quantity: 2,
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400);

    expect(response.body.message).toBe('Insufficient balance');
  });

  it('should not create order if stock is insufficient', async () => {
    const createOrderDto = {
      userId: '67da830eb198cc30ead62c6c',
      productId: '67d93bf0c96f8941774d1251',
      quantity: 10,
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto)
      .expect(400);

    expect(response.body.message).toBe('Insufficient balance');
  });

  it('should return 429 if rate limit is exceeded', async () => {
    const maxRequests = 10;
    const endpoint = '/products';

    for (let i = 0; i < maxRequests; i++) {
      await request(app.getHttpServer()).get(endpoint).expect(200);
    }

    const response = await request(app.getHttpServer())
      .get(endpoint)
      .expect(429);

    expect(response.body.message).toBe('ThrottlerException: Too Many Requests');
  });

  afterAll(async () => {
    await app.close();
  });
});
