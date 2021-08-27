import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';

@Module({
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
