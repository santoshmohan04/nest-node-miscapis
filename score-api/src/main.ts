/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Scores API')
    .setDescription('Scores API')
    .setVersion('1.0')
    .addTag('score')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  // serve Swagger UI at /api
  SwaggerModule.setup('api', app, documentFactory);
  // serve a simple HTML page at / with project details and link to Swagger
  const server = app.getHttpAdapter().getInstance();
  server.get('/', (_req, res) => {
    res.send(`
      <html>
        <head><title>Scores API</title></head>
        <body style="font-family: Arial, sans-serif; line-height:1.6; padding:24px;">
          <h1>Scores API</h1>
          <p>Minimal backend for the Scores project.</p>
          <ul>
            <li>Version: 1.0</li>
            <li>Swagger docs: <a href="/api">/api</a></li>
          </ul>
          <p>Use the <a href="/api">API documentation</a> to explore endpoints.</p>
        </body>
      </html>
    `);
  });
  app.enableCors()
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
