import { Test, TestingModule } from '@nestjs/testing';
const httpMocks = require('node-mocks-http');

import { FeedService } from './feed.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { User } from '../../auth/models/user.class';
import { FeedPost } from '../models/post.interface';
import { FeedController } from '../controllers/feed.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedPostEntity } from '../models/post.entity';

describe('FeedController', () => {
  let feedService: FeedService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.firstName = 'Onyi';

  const mockFeedPost: FeedPost = {
    body: 'body',
    createdAt: new Date(),
    author: mockRequest.user,
  };

  const mockFeedPostRepository = {
    createPost: jest
      .fn()
      .mockImplementation((user: User, feedPost: FeedPost) => {
        return {
          ...feedPost,
          author: user,
        };
      }),
    save: jest
      .fn()
      .mockImplementation((feedPost: FeedPost) =>
        Promise.resolve({ id: 1, ...feedPost }),
      ),
  };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FeedController],
      providers: [
        FeedService,
        {
          provide: getRepositoryToken(FeedPostEntity),
          useValue: mockFeedPostRepository,
        },
        {
          provide: JwtGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: IsCreatorGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    feedService = moduleRef.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(feedService).toBeDefined();
  });

  it('should create a feed post', (done: jest.DoneCallback) => {
    feedService
      .createPost(mockRequest.user, mockFeedPost)
      .subscribe((feedPost: FeedPost) => {
        expect(feedPost).toEqual({
          id: expect.any(Number),
          ...mockFeedPost,
        });
        done();
      });
  });
});
