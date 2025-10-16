import { LogLevel } from '@nestjs/common';

export function getLogLevels(logLevel: string): LogLevel[] {
  switch (logLevel.toLowerCase()) {
    case 'verbose':
      return ['log', 'error', 'warn', 'debug', 'verbose'];
    case 'debug':
      return ['log', 'error', 'warn', 'debug'];
    case 'log':
    case 'info':
      return ['log', 'error', 'warn'];
    case 'warn':
      return ['error', 'warn'];
    case 'error':
      return ['error'];
    default:
      return ['log', 'error', 'warn'];
  }
}
