import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MongoIdDto } from '../../common/dto/mongo-id.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Delete(':id')
  delete(@Param() { id }: MongoIdDto) {
    return this.usersService.delete(id);
  }
}
