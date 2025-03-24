import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'The user name cannot be empty!' })
  @IsString({ message: 'The user name must be a string value!' })
  name: string;

  @IsNotEmpty({ message: 'The email cannot be empty!' })
  @IsEmail({}, { message: 'Invalid email format!' })
  email: string;

  @IsOptional()
  @IsNumber({}, { message: 'The balance must be a number!' })
  @Min(0, { message: 'The balance cannot be negative!' })
  balance?: number;
}
