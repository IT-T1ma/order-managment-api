import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'The product name cannot be empty!' })
  @IsString({ message: 'The product name must be a sting value!' })
  name: string;

  @IsNotEmpty({ message: 'The price cannot be an empty value!' })
  @IsNumber({}, { message: 'The price must be a number!' })
  @Min(0, { message: 'The price must be at least 1!' })
  price: number;

  @IsNotEmpty({ message: 'The stock cannot be an empty value!' })
  @IsInt({ message: 'The stock must be an intеger!' })
  @Min(0, { message: 'The stock cannot be negative!' })
  stock: number;
}
