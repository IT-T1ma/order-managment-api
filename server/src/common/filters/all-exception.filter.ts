/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const messageText =
      typeof message === 'string'
        ? message
        : (message as any).message || 'Internal Server Error';

    Logger.error(
      `|${request.method} ${request.url}| |StatusCode: ${status}| Error - ${messageText}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message: messageText,
      timestamp: new Date().toLocaleString('uk-UA'),
    });
  }
}
