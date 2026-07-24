import { json, urlencoded } from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Required to read the httpOnly refresh-token cookie (auth module).
  app.use(cookieParser());

  // Default body-parser limit (100kb) is far too small for a base64-encoded
  // resume upload (documents module) sent as a normal GraphQL string arg.
  app.use(json({ limit: '8mb' }));
  app.use(urlencoded({ limit: '8mb', extended: true }));

  // Global DTO validation (Clean Architecture: transport-layer guard).
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.get<string>('webOrigin'),
    credentials: true,
  });

  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);

  Logger.log(`🚀 CareerNext API ready at http://localhost:${port}/graphql`, 'Bootstrap');
}

void bootstrap();
