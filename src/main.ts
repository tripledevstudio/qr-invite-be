import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // Global pipes
  app.useGlobalPipes(new ValidationPipe());

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global prefix
  app.setGlobalPrefix('api', { exclude: ['/'] });

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('QR INVITE API')
    .setDescription('API documentation for the NestJS application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'QR INVITE API Docs',
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCssUrl: '/api/swagger-ui.css',
    customJs: [
      '/api/swagger-ui-bundle.js',
      '/api/swagger-ui-standalone-preset.js',
    ],
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
