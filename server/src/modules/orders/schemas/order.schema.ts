import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
