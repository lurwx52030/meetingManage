import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  const configService = app.get<ConfigService>(ConfigService);
  const cors = configService.get('cors');
  if (cors) {
    app.enableCors();
  }

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new MultiHttpExceptionFilter());
  const hostname = '0.0.0.0';
  const port = process.env.PORT || 5000;

  await app.listen(5000);
}
bootstrap();
