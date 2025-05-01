import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, LogoutResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already in use',
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.authService.register(registerDto);

    // Log the user in automatically after registration
    const { accessToken, user: registeredUser } = await this.authService.login({
      email: registerDto.email,
      password: registerDto.password,
    });

    // Set cookie with the token
    this.setAuthCookie(response, accessToken);

    return { accessToken, user: registeredUser };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(loginDto);

    // Set cookie with the token
    this.setAuthCookie(response, result.accessToken);

    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout the current user' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully logged out',
    type: LogoutResponseDto,
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    // Clear the auth cookie
    response.clearCookie('auth_token');

    return {
      message: 'Logout successful',
    };
  }

  private setAuthCookie(response: Response, token: string) {
    // Set HTTP-only cookie
    response.cookie('auth_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    });
  }
}
