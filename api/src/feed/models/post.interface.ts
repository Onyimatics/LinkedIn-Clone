import { User } from '../../auth/models/user.class';
import { Comment } from '../../comment/models/comment.interface';

export interface FeedPost {
  id?: number;
  body?: string;
  createdAt?: Date;
  author?: User;
  // comments?: Comment[];
}
