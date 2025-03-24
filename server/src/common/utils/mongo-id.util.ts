import { Types } from 'mongoose';

export function isMongoDbId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}
