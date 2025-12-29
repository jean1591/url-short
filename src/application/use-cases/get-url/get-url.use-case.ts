import { IUrlRepository } from '@/domain/repositories/url.repository';
import { Url } from '@/domain/entities/url.entity';
import { NotFoundError } from '@/application/errors';

export class GetUrlUseCase {
  constructor(private readonly urlRepository: IUrlRepository) {}

  async execute(shortCode: string): Promise<Url> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundError(`Short code '${shortCode}' not found`);
    }

    return url;
  }
}
