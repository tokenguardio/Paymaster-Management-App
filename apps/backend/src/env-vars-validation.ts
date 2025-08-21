import * as joi from 'joi';

/*eslint-disable import/namespace*/
const envVarsValidationSchema = joi.object({
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development'),
  PORT: joi.number().integer().positive().default(3000).required(),
  DATABASE_URL: joi
    .string()
    .uri({ scheme: ['postgres'] })
    .required(),
  BIND_ADDRESS: joi.string().ip().default('127.0.0.1').required(),
  SWAGGER_UI_PATH: joi.string().default('docs'),
});

export const validateEnvVars = (vars: Record<string, unknown>): Record<string, unknown> => {
  const { error, value } = envVarsValidationSchema.validate(vars, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.log('DEBUG: Validation error details:', error.details);
    console.log('DEBUG: Full error object:', JSON.stringify(error, null, 2));
    throw new Error(`config validation error: ${error.message}`);
  }

  return value;
};
