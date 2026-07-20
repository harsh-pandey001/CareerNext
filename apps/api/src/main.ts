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
