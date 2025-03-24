import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/common/filters/all-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/interceptors/response-format.interceptor';
import { AppModule } from './app.module';

async function start() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();
  await app
    .listen(port || 3000)
    .then(() => console.log(`Server start on port: ${port} ✅`))
    .catch((err) => console.log('Error starting server', err));
}
void start();
