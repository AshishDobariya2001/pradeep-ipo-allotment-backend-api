import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserAccessPlatform } from 'src/frameworks/decorators/platform.decorator';
import { platform } from 'os';
import { UserPlatformType } from 'src/frameworks/enums';

@ApiTags('Authentication')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'sign up using phone number and pin code' })
  @HttpCode(200)
  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @UserAccessPlatform() userAccessPlatform: UserPlatformType,
  ) {
    return this.authService.signUp(signUpDto, userAccessPlatform);
  }

  @ApiOperation({ summary: 'Login with mobile number and pin' })
  @HttpCode(200)
  @ApiBody({
    description: 'Encrypted login data',
    schema: {
      type: 'object',
      properties: {
        payload: {
          type: 'string',
          example: 'U2FsdGVkX1+...encrypted-content...',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
