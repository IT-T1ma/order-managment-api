import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModule: Model<UserDocument>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.usersModule.findOne({ email: data.email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists!');
    }
    return await this.usersModule.create(data);
  }

  async getAll(): Promise<User[]> {
    return await this.usersModule.find();
  }

  async delete(id: string) {
    const result = await this.usersModule.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found!`);
    }
    return { message: `User with id ${id} deleted!` };
  }
}
