import { Exclude } from 'class-transformer';

export class User {
  id: string;
  name: string;
  username: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;
}
