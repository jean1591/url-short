import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { UrlController } from '@/api/controllers/url.controller';
import { HttpExceptionFilter } from '@/api/filters/http-exception.filter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UrlController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
