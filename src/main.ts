import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MultiHttpExceptionFilter } from './common/MultiHttpExceptionFilter';

async function bootstrap() {
  // enable cors
  const app = await NestFactory.create(AppModule, { cors: true });
  // const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new jwtExpiredFilter());
  app.useGlobalFilters(new MultiHttpExceptionFilter());
  await app.listen(5000);
}
bootstrap();
