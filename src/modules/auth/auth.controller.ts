import { Controller, Body, Post, HttpCode, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { UserAccessPlatform } from 'src/frameworks/decorators/platform.decorator';
import { UserPlatformType } from 'src/frameworks/enums';
import { AccessTokenDto, VerifyOtpDto } from './dto';
import { JwtAuthGuard } from 'src/frameworks/apis/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'sign up using phone number and pin code' })
  @HttpCode(200)
  // @ApiBody({
  //   description: 'Encrypted login data',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       payload: {
  //         type: 'string',
  //         example: 'U2FsdGVkX1+...encrypted-content...',
  //       },
  //     },
  //   },
  // })
  @Post('access-token')
  async getAccessToken(
    @Body() accessTokenDto: AccessTokenDto,
    @UserAccessPlatform() userAccessPlatform: UserPlatformType,
  ) {
    return this.authService.getAccessToken(accessTokenDto, userAccessPlatform);
  }

  @ApiOperation({ summary: 'sign up using phone number and pin code' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @UserAccessPlatform() userAccessPlatform: UserPlatformType,
  ) {
    return this.authService.signUp(signUpDto, userAccessPlatform);
  }

  @ApiOperation({ summary: 'Login with mobile number and pin' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  // @ApiBody({
  //   description: 'Encrypted login data',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       payload: {
  //         type: 'string',
  //         example: 'U2FsdGVkX1+...encrypted-content...',
  //       },
  //     },
  //   },
  // })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @UserAccessPlatform() userAccessPlatform: UserPlatformType,
  ) {
    return this.authService.login(loginDto, userAccessPlatform);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('verify-otp')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @UserAccessPlatform() userAccessPlatform: UserPlatformType,
  ) {
    return this.authService.verifyOtp(verifyOtpDto, userAccessPlatform);
  }
}
