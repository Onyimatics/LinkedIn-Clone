import {Post} from '../../home/models/post';

export type Role = 'admin' | 'premium' | 'user';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  posts: Post[];
}
