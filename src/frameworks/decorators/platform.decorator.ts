import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAccessPlatform = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-user-platform'];
  },
);
