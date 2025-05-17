// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 1) Create the Nest app
  const app = await NestFactory.create(AppModule, { cors: false });

  // 2) Enable CORS to allow your Next.js frontend to call it
  app.enableCors({
    origin: 'http://localhost:3000', // your Next.js URL
    credentials: true,               // allow cookies (NextAuth session)
  });

  // 3) (Optional) Global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 4) Start listening
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend listening on http://localhost:${port}`);
}

bootstrap();
