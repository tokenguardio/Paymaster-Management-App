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
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(mockLoggerInstance.debug);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(mockLoggerInstance.error);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  interface MockRequest {
    method: string;
    url: string;
    ip?: string;
    headers: Record<string, string>;
    socket?: { remoteAddress?: string };
    body?: Record<string, unknown>;
  }

  interface MockResponse {
    statusCode: number;
    setHeader: jest.Mock;
  }

  const createMockContext = (
    request: MockRequest,
    response: MockResponse = { statusCode: 200, setHeader: jest.fn() },
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
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockResponse = { statusCode: 200, setHeader: jest.fn() };
    const mockContext = createMockContext(mockRequest, mockResponse);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', 'mock-uuid-1234');
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringContaining('[mock-uuid-1234] → GET /test'),
        );
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[mock-uuid-1234\] ← GET \/test \| Status: 200 \| \d+\.\d{2}ms/),
        );
        done();
      },
    });
  });

  it('should use existing correlation ID from headers', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: { 'x-correlation-id': 'existing-id' },
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockResponse = { statusCode: 200, setHeader: jest.fn() };
    const mockContext = createMockContext(mockRequest, mockResponse);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(mockResponse.setHeader).toHaveBeenCalledWith('X-Correlation-ID', 'existing-id');
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          expect.stringContaining('[existing-id] → GET /test'),
        );
        done();
      },
    });
  });

  it('should log sanitized request body for POST requests', (done) => {
    const mockRequest = {
      method: 'POST',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      body: { username: 'testuser', email: 'test@example.com' },
    };
    const mockContext = createMockContext(mockRequest);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
          expect.stringContaining('Request Body:'),
        );
        expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
          expect.stringContaining('"username":"testuser"'),
        );
        done();
      },
    });
  });

  it('should not log request body for GET requests', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      body: { shouldNotBeLogged: 'value' },
    };
    const mockContext = createMockContext(mockRequest);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        const hasRequestBodyLog = mockLoggerInstance.debug.mock.calls.some((call) =>
          call[0].includes('Request Body:'),
        );
        expect(hasRequestBodyLog).toBe(false);
        done();
      },
    });
  });

  it('should sanitize sensitive fields', (done) => {
    const mockRequest = {
      method: 'POST',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      body: {
        username: 'testuser',
        password: 'secret123',
        token: 'bearer-token',
        apiKey: 'api-key-123',
        normalField: 'normal-value',
      },
    };
    const mockContext = createMockContext(mockRequest);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        const debugCall = mockLoggerInstance.debug.mock.calls.find((call) =>
          call[0].includes('Request Body:'),
        );
        const loggedBody = debugCall![0];

        expect(loggedBody).toContain('"password":"[REDACTED]"');
        expect(loggedBody).toContain('"token":"[REDACTED]"');
        expect(loggedBody).toContain('"apiKey":"[REDACTED]"');
        expect(loggedBody).toContain('"normalField":"normal-value"');
        done();
      },
    });
  });

  it('should sanitize nested sensitive fields', (done) => {
    const mockRequest = {
      method: 'POST',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      body: {
        user: {
          username: 'testuser',
          credentials: { password: 'secret123', apiKey: 'api-key' },
        },
      },
    };
    const mockContext = createMockContext(mockRequest);
    const mockCallHandler = { handle: () => of({ data: 'test' }) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        const debugCall = mockLoggerInstance.debug.mock.calls.find((call) =>
          call[0].includes('Request Body:'),
        );
        const loggedBody = debugCall![0];

        expect(loggedBody).toContain('"password":"[REDACTED]"');
        expect(loggedBody).toContain('"apiKey":"[REDACTED]"');
        expect(loggedBody).toContain('"username":"testuser"');
        done();
      },
    });
  });

  it('should log response data preview in debug mode', (done) => {
    const responseData = { id: 1, name: 'Test' };
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockContext = createMockContext(mockRequest);
    const mockCallHandler = { handle: () => of(responseData) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
          expect.stringContaining('[mock-uuid-1234] Response:'),
        );
        expect(mockLoggerInstance.debug).toHaveBeenCalledWith(
          expect.stringContaining(JSON.stringify(responseData)),
        );
        done();
      },
    });
  });

  it('should truncate large response data', (done) => {
    const largeData = 'x'.repeat(2000); // ← Increased from 1000 to 2000
    const responseData = { data: largeData };
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockContext = createMockContext(mockRequest);
    const mockCallHandler = { handle: () => of(responseData) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      next: () => {
        const debugCall = mockLoggerInstance.debug.mock.calls.find((call) =>
          call[0].includes('Response:'),
        );
        expect(debugCall![0]).toContain('[truncated');
        done();
      },
    });
  });

  it('should log errors with status code and stack trace', (done) => {
    const mockRequest = {
      method: 'POST',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockContext = createMockContext(mockRequest, { statusCode: 500, setHeader: jest.fn() });
    const testError = new Error('Test error') as Error & { status?: number };
    testError.status = 500;
    const mockCallHandler = { handle: () => throwError(() => testError) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: () => {
        expect(mockLoggerInstance.error).toHaveBeenCalledWith(
          expect.stringMatching(
            /\[mock-uuid-1234\] ✗ POST \/test \| Status: 500 \| \d+\.\d{2}ms \| Error: Test error/,
          ),
          expect.any(String),
        );
        done();
      },
    });
  });

  it('should handle errors without status code', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockContext = createMockContext(mockRequest);
    const testError = new Error('Generic error');
    const mockCallHandler = { handle: () => throwError(() => testError) } as CallHandler;

    interceptor.intercept(mockContext, mockCallHandler).subscribe({
      error: () => {
        expect(mockLoggerInstance.error).toHaveBeenCalledWith(
          expect.stringContaining('Status: 500'),
          expect.any(String),
        );
        done();
      },
    });
  });

  it('should re-throw the error after logging', (done) => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
    };
    const mockContext = createMockContext(mockRequest);
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
});
