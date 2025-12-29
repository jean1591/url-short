import { ApplicationError } from './application-error';

/**
 * Error thrown when input validation fails
 */
export class ValidationError extends ApplicationError {
  constructor(message: string = 'Validation failed') {
    super(message, 400);
  }
}
