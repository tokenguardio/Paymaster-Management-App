import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class BigIntExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    // Convert the response to a format that can handle BigInt
    const responseBody =
      typeof exceptionResponse === 'string' ? { message: exceptionResponse } : exceptionResponse;

    // Serialize with BigInt handling
    const serializedResponse = JSON.parse(
      JSON.stringify(responseBody, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...serializedResponse,
    });
  }
}
