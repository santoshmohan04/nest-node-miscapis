import { Module } from '@nestjs/common';
import { BotController } from './controllers/bot.controller';
import { BotService } from './service/bot.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}