import { ApplicationError } from './application-error';

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}
