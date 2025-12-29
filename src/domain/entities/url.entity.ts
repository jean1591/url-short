import { ValidationError } from '@/application/errors';

export class Url {
  private constructor(
    public readonly id: string,
    public readonly shortCode: string,
    public readonly longUrl: string,
    public readonly createdAt: Date,
  ) {
    this.validate();
  }

  static create(
    id: string,
    shortCode: string,
    longUrl: string,
    createdAt: Date,
  ): Url {
    return new Url(id, shortCode, longUrl, createdAt);
  }

  private validate(): void {
    if (!this.shortCode?.trim()) {
      throw new ValidationError('Short code is required');
    }
    if (!this.longUrl?.trim()) {
      throw new ValidationError('Long URL is required');
    }
  }
}
