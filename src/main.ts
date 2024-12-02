import { APP_CONFIG_PROPS, AppConfig } from '@marcostmunhoz/fastfood-libs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { applyGlobalAppConfig } from './main.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<AppConfig>(APP_CONFIG_PROPS.KEY);

  applyGlobalAppConfig(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Service Title')
    .setDescription('Service Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs.json',
  });

  await app.listen(config.PORT, config.HOST);
}
bootstrap();
