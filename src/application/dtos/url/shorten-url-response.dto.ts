import { Url } from '@/domain/entities/url.entity';

export interface ShortenUrlResponseDto {
  shortCode: string;
  shortUrl: string;
  longUrl: string;
}

export function toShortenUrlResponseDto(url: Url): ShortenUrlResponseDto {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  return {
    shortCode: url.shortCode,
    shortUrl: `${baseUrl}/${url.shortCode}`,
    longUrl: url.longUrl,
  };
}
