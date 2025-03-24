/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const logMessage = `|${request.method} ${request.url}| |StatusCode: ${response.statusCode}| Data - ${
          request.method === 'GET' ? 'received' : JSON.stringify(data)
        }`;

        Logger.log(logMessage, 'ResponseFormatInterceptor');

        return {
          success: true,
          statusCode: response.statusCode,
          data,
          timestamp: new Date().toLocaleString('uk-UA'),
        };
      }),
    );
  }
}
