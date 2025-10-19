import { getLogLevels } from './logging.util';

describe('getLogLevels', () => {
  it('should return all log levels for "verbose"', () => {
    const result = getLogLevels('verbose');
    expect(result).toEqual(['log', 'error', 'warn', 'debug', 'verbose']);
  });

  it('should return debug and above for "debug"', () => {
    const result = getLogLevels('debug');
    expect(result).toEqual(['log', 'error', 'warn', 'debug']);
  });

  it('should return log, error, and warn for "log"', () => {
    const result = getLogLevels('log');
    expect(result).toEqual(['log', 'error', 'warn']);
  });

  it('should return log, error, and warn for "info"', () => {
    const result = getLogLevels('info');
    expect(result).toEqual(['log', 'error', 'warn']);
  });

  it('should return error and warn for "warn"', () => {
    const result = getLogLevels('warn');
    expect(result).toEqual(['error', 'warn']);
  });

  it('should return only error for "error"', () => {
    const result = getLogLevels('error');
    expect(result).toEqual(['error']);
  });

  it('should be case insensitive', () => {
    const result = getLogLevels('VERBOSE');
    expect(result).toEqual(['log', 'error', 'warn', 'debug', 'verbose']);
  });

  it('should return default log levels for unknown log level', () => {
    const result = getLogLevels('unknown');
    expect(result).toEqual(['log', 'error', 'warn']);
  });
});
