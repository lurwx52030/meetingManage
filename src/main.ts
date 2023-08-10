import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  MultiHttpException,
  MultiHttpExceptionFilter,
} from './common/MultiHttpExceptionFilter';
import jwtExpiredFilter from './common/jwtExpiredFilter';

async function bootstrap() {
  // enable cors
  // const app = await NestFactory.create(AppModule,{ cors: true });
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new jwtExpiredFilter());
  app.useGlobalFilters(new MultiHttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
