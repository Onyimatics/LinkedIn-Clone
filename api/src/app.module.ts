// import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/services/auth.service';
import { CommentsModule } from './comment/comments.module';
import {APP_FILTER} from '@nestjs/core';
import {AllExceptionsFilter} from './shared/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // shouldn't be used in production - may lose data
    }),
    FeedModule,
    AuthModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
      AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
