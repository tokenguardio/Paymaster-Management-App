import { randomUUID } from 'crypto';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;

    // Generate correlation ID
    const correlationId = (request.headers['x-correlation-id'] as string) || randomUUID();
    response.setHeader('X-Correlation-ID', correlationId);

    // Create logger for this request
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const logger = new Logger(`${className}.${methodName}`);

    const startTime = Date.now();

    // Log incoming request
    logger.log(`[${correlationId}] → ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - startTime;
        const { statusCode } = response;

        // Log successful response
        logger.log(`[${correlationId}] ← ${method} ${url} | ${statusCode} | ${elapsedTime}ms`);
      }),
      catchError((error) => {
        const elapsedTime = Date.now() - startTime;
        const statusCode = error.status || 500;

        // Log error response
        logger.error(
          `[${correlationId}] ✗ ${method} ${url} | ${statusCode} | ${elapsedTime}ms | ${error.message}`,
        );

        return throwError(() => error);
      }),
    );
  }
}
