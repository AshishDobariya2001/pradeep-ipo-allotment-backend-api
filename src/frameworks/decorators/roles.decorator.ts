import { SetMetadata } from '@nestjs/common';

// This decorator will be used to specify which roles are required for a specific route
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
