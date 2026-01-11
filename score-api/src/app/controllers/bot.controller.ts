import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BotService } from '../service/bot.service';
import { BotIntentDto } from '../dto/bot.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('bot')
@UseGuards(JwtAuthGuard)
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('intent')
  async processIntent(@Body() botIntentDto: BotIntentDto) {
    return this.botService.detectIntent(botIntentDto.text);
  }
}