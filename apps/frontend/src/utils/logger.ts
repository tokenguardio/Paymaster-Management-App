const parseCallerInfoFromStack = (stackLine) => {
  const callerMatch = stackLine.match(/\(([^)]+)\)/);
  return callerMatch ? callerMatch[1].split(':') : ['unknown', 'unknown'];
};

const extractFunctionNameFromStack = (stackLine) => {
  const funcMatch = stackLine.match(/at (.+?)\s/);
  return funcMatch ? funcMatch[1] : 'unknown';
};

const getCallerInfo = () => {
  try {
    const stack = new Error().stack.split('\n').slice(3);
    const [filePath, line] = parseCallerInfoFromStack(stack[0]);
    const func = extractFunctionNameFromStack(stack[0]);
    return { filePath: filePath + ':' + line, func };
  } catch {
    return { filePath: 'unknown:unknown', func: 'unknown' };
  }
};

const formatArgs = (args) =>
  args
    .map((arg) => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return arg.toString();
        }
      }
      return arg;
    })
    .join(' ');

const logMessage = (level, args) => {
  const message = formatArgs(args);
  let formattedMessage = `[${level}] [${new Date().toISOString()}] ${message}`;

  if (process.env.REACT_APP_DEPLOY_ENV !== 'production') {
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
  info: (...args) => logMessage('info', args),
  warn: (...args) => logMessage('warn', args),
  error: (...args) => logMessage('error', args),
  debug: (...args) => logMessage('debug', args),
};
