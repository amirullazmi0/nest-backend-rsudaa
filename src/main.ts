import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const loggerService = app.get(WINSTON_MODULE_NEST_PROVIDER)
  // app.useLogger(loggerService)
  const env = app.get(ConfigService)
  await app.listen(env.get('PORT') || 3000);
}
bootstrap();
