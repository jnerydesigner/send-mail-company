import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const config = new ConfigService();

  const port = config.get('SERVER_PORT');

  await app.listen(port, () => {
    logger.log(`Server started on http://localhost:${port}`);
  });
}
bootstrap();
