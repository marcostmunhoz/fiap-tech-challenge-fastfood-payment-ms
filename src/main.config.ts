import {
  GlobalExceptionFilter,
  TransformationPipe,
  ValidationPipe,
} from '@marcostmunhoz/fastfood-libs';
import { INestApplication, RequestMethod } from '@nestjs/common';

export const applyGlobalAppConfig = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe(), new TransformationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'api/docs', method: RequestMethod.GET },
      { path: 'api/docs.json', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });
};
