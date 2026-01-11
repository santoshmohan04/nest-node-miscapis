import { Controller, Post, Body, UseGuards, Request, Patch } from '@nestjs/common';
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