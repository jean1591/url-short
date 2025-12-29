import {
  ShortenUrlDto,
  shortenUrlSchema,
} from '@/application/dtos/url/shorten-url.dto';
import {
  ShortenUrlResponseDto,
  toShortenUrlResponseDto,
} from '@/application/dtos/url/shorten-url-response.dto';

import { IUrlRepository } from '@/domain/repositories/url.repository';
import { Url } from '@/domain/entities/url.entity';
import { ValidationError } from '@/application/errors';
import { generateShortCode } from '@/application/utils/generate-short-code';

export class ShortenUrlUseCase {
  constructor(private readonly urlRepository: IUrlRepository) {}

  async execute(data: ShortenUrlDto): Promise<ShortenUrlResponseDto> {
    // Validate input
    const validationResult = shortenUrlSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ValidationError(
        validationResult.error.errors[0]?.message || 'Invalid URL data',
      );
    }

    const validatedData = validationResult.data;

    // Generate unique short code
    let shortCode: string;
    let existingUrl: Url | null;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode(6);
      existingUrl = await this.urlRepository.findByShortCode(shortCode);
      attempts++;

      if (attempts >= maxAttempts) {
        throw new ValidationError(
          'Failed to generate unique short code. Please try again.',
        );
      }
    } while (existingUrl !== null);

    // Create URL entity
    const url = Url.create('', shortCode, validatedData.longUrl, new Date());

    // Persist to database
    const createdUrl = await this.urlRepository.create(url);

    return toShortenUrlResponseDto(createdUrl);
  }
}
