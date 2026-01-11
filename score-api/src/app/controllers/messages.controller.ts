import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from '../service/messages.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':threadId')
  async findByThread(@Param('threadId') threadId: string) {
    return this.messagesService.findByThread(threadId);
  }
}