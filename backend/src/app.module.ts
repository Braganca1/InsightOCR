import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { InteractionsModule } from './interactions/interactions.module';

@Module({
  imports: [PrismaModule, UsersModule, DocumentsModule, InteractionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

