import { IsNotEmpty, IsString } from 'class-validator';

export class BotIntentDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class BotResponseDto {
  intent: 'weather' | 'currency' | 'joke' | 'unknown';
  response: string;
  data?: any;
}

export class FcmTokenDto {
  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}