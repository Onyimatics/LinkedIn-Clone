import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FeedPostEntity } from '../../feed/models/post.entity';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  // @ManyToOne(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.comments)
  // post: FeedPostEntity;
}
