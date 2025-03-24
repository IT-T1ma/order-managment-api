import { IsMongoId } from 'class-validator';

export class MongoIdDto {
  @IsMongoId({ message: 'Invalid ObjectId format!' })
  id: string;
}
