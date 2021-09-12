import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';

import * as fs from 'fs';
import * as morgan from 'morgan';

import { AppModule } from './app.module';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a', // append
})

async function bootstrap() {
  let cors = require('cors');
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(3000);
}
bootstrap();
