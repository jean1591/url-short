import { NextFunction, Request, Response } from 'express';

import { GetUrlUseCase } from '@/application/use-cases/get-url/get-url.use-case';
import { UrlRepository } from '@/infrastructure/repositories/url.repository';
import { prisma } from '@/infrastructure/database/prisma-client';

// Initialize dependencies
const urlRepository = new UrlRepository(prisma);
const getUrlUseCase = new GetUrlUseCase(urlRepository);

/**
 * Controller to redirect given a shortened url
 * GET /:shortCode
 */
export async function getUrlController(
  req: Request<{ shortCode: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { shortCode } = req.params;
    const url = await getUrlUseCase.execute(shortCode);
    res.redirect(301, url.longUrl);
  } catch (error) {
    next(error);
  }
}
