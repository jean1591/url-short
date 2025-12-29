import { GetUrlUseCase } from './get-url.use-case';
import { IUrlRepository } from '@/domain/repositories/url.repository';
import { Url } from '@/domain/entities/url.entity';
import { NotFoundError } from '@/application/errors';

describe('GetUrlUseCase', () => {
  let useCase: GetUrlUseCase;
  let mockRepository: jest.Mocked<IUrlRepository>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      findByShortCode: jest.fn(),
    };

    useCase = new GetUrlUseCase(mockRepository);

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return URL when short code exists', async () => {
      // Arrange
      const shortCode = 'abc123';
      const expectedUrl = Url.create(
        '1',
        shortCode,
        'https://www.google.com',
        new Date(),
      );

      mockRepository.findByShortCode.mockResolvedValue(expectedUrl);

      // Act
      const result = await useCase.execute(shortCode);

      // Assert
      expect(result).toEqual(expectedUrl);
      expect(mockRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
      expect(mockRepository.findByShortCode).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when short code does not exist', async () => {
      // Arrange
      const shortCode = 'nonexistent';
      mockRepository.findByShortCode.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(shortCode)).rejects.toThrow(NotFoundError);
      await expect(useCase.execute(shortCode)).rejects.toThrow(
        `Short code 'nonexistent' not found`,
      );
      expect(mockRepository.findByShortCode).toHaveBeenCalledWith(shortCode);
    });

    it('should handle different short code formats', async () => {
      // Arrange
      const shortCodes = ['abc123', 'XYZ789', 'aBc12Z', '123456'];

      for (const shortCode of shortCodes) {
        const url = Url.create(
          '1',
          shortCode,
          'https://www.example.com',
          new Date(),
        );
        mockRepository.findByShortCode.mockResolvedValue(url);

        // Act
        const result = await useCase.execute(shortCode);

        // Assert
        expect(result.shortCode).toBe(shortCode);
      }
    });

    it('should return URL with correct long URL', async () => {
      // Arrange
      const shortCode = 'test12';
      const longUrl = 'https://www.example.com/very/long/path?param=value';
      const url = Url.create('1', shortCode, longUrl, new Date());

      mockRepository.findByShortCode.mockResolvedValue(url);

      // Act
      const result = await useCase.execute(shortCode);

      // Assert
      expect(result.longUrl).toBe(longUrl);
    });

    it('should call repository only once per execution', async () => {
      // Arrange
      const shortCode = 'test99';
      const url = Url.create(
        '1',
        shortCode,
        'https://www.example.com',
        new Date(),
      );

      mockRepository.findByShortCode.mockResolvedValue(url);

      // Act
      await useCase.execute(shortCode);

      // Assert
      expect(mockRepository.findByShortCode).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const shortCode = 'error1';
      const dbError = new Error('Database connection failed');

      mockRepository.findByShortCode.mockRejectedValue(dbError);

      // Act & Assert
      await expect(useCase.execute(shortCode)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
