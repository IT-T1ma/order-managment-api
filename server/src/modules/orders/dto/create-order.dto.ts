import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'User ID is required!' })
  @IsMongoId({ message: 'User ID must be a valid ObjectId!' })
  userId: string;

  @IsNotEmpty({ message: 'Product ID is required!' })
  @IsMongoId({ message: 'Product ID must be a valid ObjectId!' })
  productId: string;

  @IsNotEmpty({ message: 'Quantity is required!' })
  @IsInt({ message: 'Quantity must be an integer!' })
  @Min(1, { message: 'Quantity must be at least 1!' })
  quantity: number;
}
