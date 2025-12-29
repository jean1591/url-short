import { ApplicationError } from './application-error';

/**
 * Error thrown when a database operation fails
 */
export class DatabaseError extends ApplicationError {
  constructor(
    message: string = 'Database operation failed',
    originalError?: Error,
  ) {
    super(message, 500);
    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}
