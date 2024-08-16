import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ENDPOINT_PREFIX, PORT } from './frameworks/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserPlatformType } from './frameworks/enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(ENDPOINT_PREFIX);
  console.log(process.env.DATABASE_URL, process.env.PORT);
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

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
    // .addSecurity('apiKey', {
    //   type: 'apiKey',
    //   in: 'header',
    //   name: 'x-api-key',
    //   description: 'API Key for authentication',
    // })
    .addGlobalParameters({
      name: 'x-user-platform',
      in: 'header',
      required: false,
      description: `User platform header. Allowed values: ${Object.values(UserPlatformType).join(', ')}`, // {{ edit_2 }}
      schema: {
        type: 'string',
        enum: Object.values(UserPlatformType),
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(ENDPOINT_PREFIX, app, document);
}

bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`);
  throw e;
});
