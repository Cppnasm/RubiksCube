import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOG_LEVEL, PORT } from './global-config';
import * as moment from 'moment';
import * as cookieParser from 'cookie-parser';
import arcsightLoggingMiddleware from './utils/arcsight-logging-middleware';



let app: INestApplication;
const logger = new Logger('Main.ts');

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger:
      LOG_LEVEL === 'debug'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['log', 'error', 'verbose', 'warn'],
    cors: true,
  });

  app.use(cookieParser());
  app.use(arcsightLoggingMiddleware);
  app.enableShutdownHooks();

  moment.locale('en');
  await app.listen(PORT, () => {
    console.log(`\nServer started on port: ${PORT}`);
  });

  process.on('SIGTERM', async () => {
    console.log('\nprocess exiting with SIGTERM\n');
    await app.close();
    process.exit(0);
  });

  process.on('SIGUSR1', async () => {
    console.log('\nprocess SIGUSR1\n');
  });
}
bootstrap();
