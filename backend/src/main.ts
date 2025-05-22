import { NestFactory }    from '@nestjs/core';
import { AppModule }      from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser  from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.use(cookieParser());

  // 2) Enable CORS for your Next.js frontend (with credentials)
  app.enableCors({
    origin: process.env.FRONTEND_URL?.split(',') || 'http://localhost:3000',
    credentials: true,
  });

  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = parseInt(process.env.PORT || '4000', 10);
  await app.listen(port);
  console.log(`🚀 Backend listening on port ${port}`);
}

bootstrap();
