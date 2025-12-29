import { Controller, Post, Get, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { ShortenUrlDto } from '@/application/dtos/url/shorten-url.dto';
import { ShortenUrlUseCase } from '@/application/use-cases/shorten-url/shorten-url.use-case';
import { GetUrlUseCase } from '@/application/use-cases/get-url/get-url.use-case';
import { UrlRepository } from '@/infrastructure/repositories/url.repository';
import { prisma } from '@/infrastructure/database/prisma-client';

// Initialize dependencies
const urlRepository = new UrlRepository(prisma);
const shortenUrlUseCase = new ShortenUrlUseCase(urlRepository);
const getUrlUseCase = new GetUrlUseCase(urlRepository);

/**
 * Controller for URL shortening endpoints
 */
@Controller('api/url')
export class UrlController {
  /**
   * Create a shortened URL
   * POST /api/url
   */
  @Post()
  async create(@Body() dto: ShortenUrlDto) {
    const result = await shortenUrlUseCase.execute(dto);
    return result;
  }

  /**
   * Redirect to original URL given a short code
   * GET /api/url/:shortCode
   */
  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await getUrlUseCase.execute(shortCode);
    res.redirect(301, url.longUrl);
  }
}
