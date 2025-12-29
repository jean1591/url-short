import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApplicationError } from '@/application/errors';

/**
 * Global exception filter for handling application errors
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Log error for debugging
    console.error('Error:', exception);

    // Handle known application errors
    if (exception instanceof ApplicationError) {
      response.status(exception.statusCode).json({
        error: exception.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: exception.stack,
        }),
      });
      return;
    }

    // Handle unknown errors
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        message: exception.message,
        stack: exception.stack,
      }),
    });
  }
}
