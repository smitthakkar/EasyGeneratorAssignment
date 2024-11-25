import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ThrottlerExceptionFilter } from './filters/throttler-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Automatically transform payloads to match DTOs
    }),
  );
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1); 
  // Enable Swagger only in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Easy Generator Authentication API')
      .setDescription('The authentication API for the project')
      .setVersion('1.0')
      .addTag('auth')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);  // Swagger UI will be available at /api/docs
    Logger.log('Swagger is enabled in development mode');
  }
  await app.listen(3001);
}
bootstrap();