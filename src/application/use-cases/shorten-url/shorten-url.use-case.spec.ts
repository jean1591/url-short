import { ShortenUrlUseCase } from './shorten-url.use-case';
import { IUrlRepository } from '@/domain/repositories/url.repository';
import { Url } from '@/domain/entities/url.entity';
import { ValidationError } from '@/application/errors';
import { generateShortCode } from '@/application/utils/generate-short-code';

// Mock the generateShortCode function
jest.mock('@/application/utils/generate-short-code');

describe('ShortenUrlUseCase', () => {
  let useCase: ShortenUrlUseCase;
  let mockRepository: jest.Mocked<IUrlRepository>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      findByShortCode: jest.fn(),
    };

    useCase = new ShortenUrlUseCase(mockRepository);

    // Reset mock
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should create a shortened URL with valid input', async () => {
      // Arrange
      const input = { longUrl: 'https://www.google.com' };
      const shortCode = 'abc123';
      const createdUrl = Url.create(
        '123',
        shortCode,
        input.longUrl,
        new Date(),
      );

      (generateShortCode as jest.Mock).mockReturnValue(shortCode);
      mockRepository.findByShortCode.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdUrl);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual({
        shortCode,
        shortUrl: expect.stringContaining(shortCode),
        longUrl: input.longUrl,
      });
      expect(mockRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          shortCode,
          longUrl: input.longUrl,
        }),
      );
    });

    it('should throw ValidationError for invalid URL format', async () => {
      // Arrange
      const input = { longUrl: 'not-a-valid-url' };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for empty URL', async () => {
      // Arrange
      const input = { longUrl: '' };

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(ValidationError);
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should retry when short code already exists', async () => {
      // Arrange
      const input = { longUrl: 'https://www.example.com' };
      const existingShortCode = 'exists1';
      const newShortCode = 'new123';
      const existingUrl = Url.create(
        '1',
        existingShortCode,
        'https://other.com',
        new Date(),
      );
      const createdUrl = Url.create(
        '2',
        newShortCode,
        input.longUrl,
        new Date(),
      );

      (generateShortCode as jest.Mock)
        .mockReturnValueOnce(existingShortCode)
        .mockReturnValueOnce(newShortCode);

      mockRepository.findByShortCode
        .mockResolvedValueOnce(existingUrl) // First attempt: collision
        .mockResolvedValueOnce(null); // Second attempt: success

      mockRepository.create.mockResolvedValue(createdUrl);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.shortCode).toBe(newShortCode);
      expect(generateShortCode).toHaveBeenCalledTimes(2);
      expect(mockRepository.findByShortCode).toHaveBeenCalledTimes(2);
    });

    it('should throw ValidationError when max attempts reached', async () => {
      // Arrange
      const input = { longUrl: 'https://www.example.com' };
      const existingUrl = Url.create(
        '1',
        'exists',
        'https://other.com',
        new Date(),
      );

      (generateShortCode as jest.Mock).mockReturnValue('exists');
      mockRepository.findByShortCode.mockResolvedValue(existingUrl);

      // Act & Assert
      const promise = useCase.execute(input);
      await expect(promise).rejects.toThrow(ValidationError);
      await expect(promise).rejects.toThrow(
        'Failed to generate unique short code',
      );

      // Should have attempted 10 times (max attempts)
      expect(mockRepository.findByShortCode).toHaveBeenCalledTimes(10);
    });

    it('should handle URLs with query parameters', async () => {
      // Arrange
      const input = {
        longUrl: 'https://www.example.com/page?param1=value1&param2=value2',
      };
      const shortCode = 'test12';
      const createdUrl = Url.create('1', shortCode, input.longUrl, new Date());

      (generateShortCode as jest.Mock).mockReturnValue(shortCode);
      mockRepository.findByShortCode.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdUrl);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.longUrl).toBe(input.longUrl);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          longUrl: input.longUrl,
        }),
      );
    });

    it('should handle HTTPS URLs', async () => {
      // Arrange
      const input = { longUrl: 'https://secure-site.com' };
      const shortCode = 'sec123';
      const createdUrl = Url.create('1', shortCode, input.longUrl, new Date());

      (generateShortCode as jest.Mock).mockReturnValue(shortCode);
      mockRepository.findByShortCode.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdUrl);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.longUrl).toBe(input.longUrl);
    });
  });
});
