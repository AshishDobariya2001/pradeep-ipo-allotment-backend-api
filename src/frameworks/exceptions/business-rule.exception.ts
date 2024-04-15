import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessRuleException extends HttpException {
  constructor(message: any) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
