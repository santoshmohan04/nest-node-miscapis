import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    console.log('=== JWT Validation Debug ===');
    console.log('Payload:', payload);
    console.log('Authorization header:', req.headers.authorization);
    
    // Extract token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log('Extracted token:', token ? 'Token found' : 'No token');
    
    // Check if token is blacklisted
    if (token) {
      const isBlacklisted = await this.authService.isTokenBlacklisted(token);
      console.log('Is token blacklisted?', isBlacklisted);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }

    console.log('Validation successful, returning user:', { userId: payload.sub, email: payload.email });
    return { userId: payload.sub, email: payload.email };
  }
}