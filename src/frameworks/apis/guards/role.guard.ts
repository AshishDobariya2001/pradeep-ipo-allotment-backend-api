import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard'; // Assuming JwtAuthGuard is in the same directory
import { Reflector } from '@nestjs/core';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super(); // Call the constructor of JwtAuthGuard
  }

  canActivate(context: ExecutionContext): boolean {
    const canActivate = super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    // Then check if the role-based metadata is present
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // If no roles are defined, allow access
    }

    // Access the user object from the request, which is set by JwtStrategy
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if the user has one of the required roles
    const hasRole = requiredRoles.some((role) => user?.role?.includes(role));
    if (!hasRole) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND_TRY_AGAIN);
    }

    return true;
  }
}
