import { DatabaseError } from '@/application/errors';
import { IUrlRepository } from '@/domain/repositories/url.repository';
import { PrismaClient, Url as PrismaUrl } from '@prisma/client';
import { Url } from '@/domain/entities/url.entity';

export class UrlRepository implements IUrlRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(url: Url): Promise<Url> {
    try {
      const createdUrl: PrismaUrl = await this.prisma.url.create({
        data: {
          shortCode: url.shortCode,
          longUrl: url.longUrl,
        },
      });

      return this.toDomain(createdUrl);
    } catch (error) {
      throw new DatabaseError('Failed to create URL', error as Error);
    }
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    try {
      const foundUrl: PrismaUrl | null = await this.prisma.url.findUnique({
        where: { shortCode },
      });

      return foundUrl ? this.toDomain(foundUrl) : null;
    } catch (error) {
      throw new DatabaseError('Failed to find URL', error as Error);
    }
  }

  /**
   * Convert Prisma model to domain entity
   */
  private toDomain(prismaModel: PrismaUrl): Url {
    return Url.create(
      prismaModel.id,
      prismaModel.shortCode,
      prismaModel.longUrl,
      prismaModel.createdAt,
    );
  }
}
