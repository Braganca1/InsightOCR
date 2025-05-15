import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';                    // ← make sure .env is loaded


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);
}
console.log('OPENAI_API_KEY=', process.env.OPENAI_API_KEY);
bootstrap();
