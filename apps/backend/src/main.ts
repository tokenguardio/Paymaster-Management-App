import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const loggerContext = 'bootstrap';

  Logger.log('bootstrapping...', loggerContext);
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow('PORT');
  const BIND_ADDRESS = configService.getOrThrow('BIND_ADDRESS');
  const SWAGGER_UI_PATH = configService.getOrThrow('SWAGGER_UI_PATH');
  const NODE_ENV = configService.get('NODE_ENV');

  // Enable CORS for development
  if (NODE_ENV === 'development') {
    app.enableCors();
    Logger.log('CORS enabled for development', loggerContext);
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
