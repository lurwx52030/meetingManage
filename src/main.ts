import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MultiHttpExceptionFilter } from './common/MultiHttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  const cors = configService.get('cors');
  if (cors) {
    app.enableCors();
  }

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MultiHttpExceptionFilter());
  await app.listen(5000);
}
bootstrap();
