import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController, UsersController } from './controllers/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtStrategy } from './service/jwt.strategy';
import { User, UserSchema } from './schema/user.schema';
import { TokenBlacklist, TokenBlacklistSchema } from './schema/token-blacklist.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: TokenBlacklist.name, schema: TokenBlacklistSchema },
    ]),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}