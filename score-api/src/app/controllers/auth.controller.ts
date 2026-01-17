import { Controller, Post, Body, UseGuards, Request, Patch, Get } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { FcmTokenDto } from '../dto/bot.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    // Extract token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await this.authService.blacklistToken(token);
    }
    
    return { message: 'Logged out successfully' };
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('fcm-token')
  async updateFcmToken(@Request() req, @Body() fcmTokenDto: FcmTokenDto) {
    await this.authService.updateFcmToken(req.user.userId, fcmTokenDto.fcmToken);
    return { message: 'FCM token updated successfully' };
  }
}