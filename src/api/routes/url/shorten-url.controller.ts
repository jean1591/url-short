import { NextFunction, Request, Response } from 'express';

import { ShortenUrlDto } from '@/application/dtos/url/shorten-url.dto';
import { ShortenUrlUseCase } from '@/application/use-cases/shorten-url/shorten-url.use-case';
import { UrlRepository } from '@/infrastructure/repositories/url.repository';
import { prisma } from '@/infrastructure/database/prisma-client';

// Initialize dependencies
const urlRepository = new UrlRepository(prisma);
const shortenUrlUseCase = new ShortenUrlUseCase(urlRepository);

/**
 * Controller to shorten url
 * POST /url
 */
export async function shortenUrlController(
  req: Request<object, object, ShortenUrlDto>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await shortenUrlUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
