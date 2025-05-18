import { NestFactory }    from '@nestjs/core';
import { AppModule }      from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser  from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  
  app.use(cookieParser());

  // 2) Enable CORS for your Next.js frontend (with credentials)
  app.enableCors({
    origin:      'http://localhost:3000',
    credentials: true,
  });

  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(4000);
  console.log(`🚀 Backend listening on http://localhost:4000`);
}

bootstrap();
