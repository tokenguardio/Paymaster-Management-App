import { ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid-1234'),
}));

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockLoggerInstance: jest.Mocked<Logger>;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockLoggerInstance = {
      log: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      verbose: jest.fn(),
    } as unknown as jest.Mocked<Logger>;

    jest.spyOn(Logger.prototype, 'log').mockImplementation(mockLoggerInstance.log);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLoggerInstance.error);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  interface IMockRequest {
    method: string;
    url: string;
    headers: Record<string, string>;
  }

  interface IMockResponse {
    statusCode: number;
    setHeader: jest.Mock;
  }

  const createMockContext = (
    request: IMockRequest,
    response: IMockResponse = { statusCode: 200, setHeader: jest.fn() },
  ): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => response,
      }),
      getClass: () => ({ name: 'TestController' }),
      getHandler: () => ({ name: 'testHandler' }),
    }) as unknown as ExecutionContext;

  it('should be defined', (): void => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response with correlation ID', (done) => {
    const ImockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
    };
    const ImockResponse = { statusCode: 200, setHeader: jest.fn() };
    const mockContext = createMockContext(ImockRequest, ImockResponse);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(ImockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', 'mock-uuid-1234');
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringContaining('[mock-uuid-1234] → GET /test'),
        );
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[mock-uuid-1234\] ← GET \/test \| 200 \| \d+ms/),
        );
        done();
      },
    });
  });

  it('should use existing correlation ID from headers', (done) => {
    const ImockRequest = {
      method: 'GET',
      url: '/test',
      headers: { 'x-correlation-id': 'existing-id' },
    };
    const ImockResponse = { statusCode: 200, setHeader: jest.fn() };
    const mockContext = createMockContext(ImockRequest, ImockResponse);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(ImockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', 'existing-id');
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringContaining('[existing-id] → GET /test'),
        );
        done();
      },
    });
  });

  it('should log errors with status code', (done) => {
    const ImockRequest = {
      method: 'POST',
      url: '/test',
      headers: {},
    };
    const mockContext = createMockContext(ImockRequest, { statusCode: 500, setHeader: jest.fn() });
    const testError = new Error('Test error') as Error & { status?: number };
    testError.status = 400;
    const mockCallHandler = { handle: () => throwError(() => testError) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: () => {
        expect(mockLoggerInstance.error).toHaveBeenCalledWith(
          expect.stringMatching(/\[mock-uuid-1234\] ✗ POST \/test \| 400 \| \d+ms \| Test error/),
        );
        done();
      },
    });
  });

  it('should handle errors without status code (defaults to 500)', (done) => {
    const ImockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
    };
    const mockContext = createMockContext(ImockRequest);
    const testError = new Error('Generic error');
    const mockCallHandler = { handle: () => throwError(() => testError) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: () => {
        expect(mockLoggerInstance.error).toHaveBeenCalledWith(expect.stringContaining('| 500 |'));
        done();
      },
    });
  });

  it('should re-throw the error after logging', (done) => {
    const ImockRequest = {
      method: 'GET',
      url: '/test',
      headers: {},
    };
    const mockContext = createMockContext(ImockRequest);
    const testError = new Error('Test error');
    const mockCallHandler = { handle: () => throwError(() => testError) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: (error) => {
        expect(error).toBe(testError);
        expect(error.message).toBe('Test error');
        done();
      },
    });
  });

  it('should log different HTTP methods correctly', (done) => {
    const ImockRequest = {
      method: 'PUT',
      url: '/users/123',
      headers: {},
    };
    const ImockResponse = { statusCode: 204, setHeader: jest.fn() };
    const mockContext = createMockContext(ImockRequest, ImockResponse);
    const mockCallHandler = { handle: () => of(null) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringContaining('PUT /users/123'),
        );
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(expect.stringContaining('| 204 |'));
        done();
      },
    });
  });
});
