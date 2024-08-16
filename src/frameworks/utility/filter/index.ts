import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.getResponse();
    const errorCode = (exception as any).errorCode || '';

    // const message =
    //   typeof errorResponse === 'object'
    //     ? errorResponse['message']
    //     : errorResponse;

    if (!response.headersSent) {
      response.status(status).json(message);
    }
  }
}
