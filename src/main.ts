import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ENDPOINT_PREFIX, PORT } from './frameworks/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserPlatformType } from './frameworks/enums';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`${ENDPOINT_PREFIX}`);
  console.log(process.env.DATABASE_URL, process.env.PORT);
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  app.use(
    [`/${ENDPOINT_PREFIX}/docs`, `/${ENDPOINT_PREFIX}/docs-json`],
    basicAuth({
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
      challenge: true,
    }),
  );

  initializeSwagger(app);

  await app.listen(PORT);
  Logger.debug(`🚀  Server is listening on port ${PORT}`);
}

function initializeSwagger(app) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('IPO Allotment API')
    .setDescription('IPO Allotment API')
    .setVersion('v1')
    .addGlobalParameters({
      name: 'x-user-platform',
      in: 'header',
      required: true,
      description: `User platform header. Allowed values: ${Object.values(UserPlatformType).join(', ')}`,
      schema: {
        type: 'string',
        enum: Object.values(UserPlatformType),
      },
    })
    .addGlobalParameters({
      name: 'x-user-device-id',
      in: 'header',
      required: true,
      description: 'User device id header',
      schema: {
        type: 'string',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${ENDPOINT_PREFIX}/docs`, app, document);
}

bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`);
  throw e;
});
