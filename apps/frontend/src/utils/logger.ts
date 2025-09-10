const parseCallerInfoFromStack = (stackLine: string) => {
  const callerMatch = stackLine.match(/\(([^)]+)\)/);
  return callerMatch ? callerMatch[1].split(':') : ['unknown', 'unknown'];
};

const extractFunctionNameFromStack = (stackLine: string) => {
  const funcMatch = stackLine.match(/at (.+?)\s/);
  return funcMatch ? funcMatch[1] : 'unknown';
};

const getCallerInfo = () => {
  try {
    const errStack = new Error().stack;
    const stack = errStack ? errStack.split('\n').slice(3) : [];
    const [filePath, line] = parseCallerInfoFromStack(stack[0]);
    const func = extractFunctionNameFromStack(stack[0]);
    return { filePath: filePath + ':' + line, func };
  } catch {
    return { filePath: 'unknown:unknown', func: 'unknown' };
  }
};

const formatArgs = <T>(args: T[]): string =>
  args
    .map((arg) => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return arg?.toString();
        }
      }
      return arg;
    })
    .join(' ');

const logMessage = (level: string, args: unknown[]) => {
  const message = formatArgs(args);
  let formattedMessage = `[${level}] [${new Date().toISOString()}] ${message}`;

  if (import.meta.env.REACT_APP_DEPLOY_ENV !== 'production') {
    const { filePath, func } = getCallerInfo();
    formattedMessage = `[${level}] [${new Date().toISOString()}] [${filePath}, ${func}] ${message}`;
  }

  if (level === 'info') {
    console.log(formattedMessage);
  } else if (level === 'warn') {
    console.warn(formattedMessage);
  } else if (level === 'error') {
    console.error(formattedMessage);
  } else if (level === 'debug') {
    console.debug(formattedMessage);
  }
};

export const logger = {
  info: (...args: unknown[]) => logMessage('info', args),
  warn: (...args: unknown[]) => logMessage('warn', args),
  error: (...args: unknown[]) => logMessage('error', args),
  debug: (...args: unknown[]) => logMessage('debug', args),
};
