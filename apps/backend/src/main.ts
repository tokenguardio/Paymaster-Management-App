import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { BigIntInterceptor } from './shared/interceptors/big-int.interceptor';
import { getLogLevels } from './shared/util/logging.util';

async function bootstrap(): Promise<void> {
  const loggerContext = 'bootstrap';
  Logger.log('bootstrapping...', loggerContext);

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new BigIntInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  const BIND_ADDRESS = configService.getOrThrow('BIND_ADDRESS');
  const SWAGGER_UI_PATH = configService.getOrThrow('SWAGGER_UI_PATH');
  const NODE_ENV = configService.get('NODE_ENV');
  const SESSION_SECRET = configService.get('SESSION_SECRET', 'siwe-secret');
  const FRONTEND_URL = configService.get('FRONTEND_URL', 'http://localhost:3001');
  const LOG_LEVEL = configService.get('LOG_LEVEL', 'debug');

  app.useLogger(getLogLevels(LOG_LEVEL));

  Logger.log(`Log level: ${LOG_LEVEL}`, loggerContext);

  // Configure session middleware for SIWE
  app.use(
    session({
      name: 'siwe-session',
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        // sameSite: 'lax',
        sameSite: false,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );
  Logger.log('Session middleware configured', loggerContext);

  // Configure CORS
  if (NODE_ENV === 'development') {
    app.enableCors({
      origin: FRONTEND_URL,
      credentials: true, // Important for cookies/sessions
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    Logger.log(`CORS enabled for development (origin: ${FRONTEND_URL})`, loggerContext);
  } else {
    // Production CORS configuration
    app.enableCors({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      origin: (origin: any, callback: any) => {
        // Configure allowed origins for production
        const allowedOrigins = [FRONTEND_URL];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    });
  }

  const openAPIDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Paymaster Management API Service').setVersion('').build(),
  );
  SwaggerModule.setup(SWAGGER_UI_PATH, app, openAPIDocument);

  Logger.log(`binding to ${BIND_ADDRESS}:${PORT}...`, loggerContext);
  await app.listen(PORT, BIND_ADDRESS);
  Logger.log(`listening at http://${BIND_ADDRESS}:${PORT}`, loggerContext);
  Logger.log(
    `Swagger UI available at http://${BIND_ADDRESS}:${PORT}/${SWAGGER_UI_PATH}`,
    loggerContext,
  );
}

void bootstrap();
