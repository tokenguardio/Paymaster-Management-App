import { validateEnvVars } from './env-vars-validation';

describe(validateEnvVars.name, function () {
  it('should return config object with parsed env vars when provided with env vars valid', async function () {
    const result = validateEnvVars({
      NODE_ENV: 'development',
      PORT: '3000',
      BIND_ADDRESS: '127.0.0.1',
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
    });

    expect(result).toEqual({
      BIND_ADDRESS: '127.0.0.1',
      NODE_ENV: 'development',
      PORT: 3000,
      SWAGGER_UI_PATH: 'docs',
      DATABASE_URL: 'postgres://user:pass@localhost:5432/db',
    });
  });

  it('should throw an error when env vars invalid', async function () {
    try {
      validateEnvVars({
        NODE_ENV: 'dev',
        PORT: '0',
        BIND_ADDRESS: '1127.0.0.1',
        DATABASE_URL: 'postgress://user:pass@localhost:5432/db',
      });
      expect(true).toBe(false); // this should not be reached
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (!(error instanceof Error)) throw new Error('this should not be reached');
      expect(error.message).toBe(
        'config validation error: "NODE_ENV" must be one of [development, production, test]. "PORT" must be a positive number. "DATABASE_URL" must be a valid uri with a scheme matching the postgres pattern. "BIND_ADDRESS" must be a valid ip address with a optional CIDR',
      );
    }
  });
});
