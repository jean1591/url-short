import { Url } from '@/domain/entities/url.entity';

export interface IUrlRepository {
  create(url: Url): Promise<Url>;
  findByShortCode(shortCode: string): Promise<Url | null>;
}
