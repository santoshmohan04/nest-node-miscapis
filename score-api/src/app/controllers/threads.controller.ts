import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ThreadsService } from '../service/threads.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('threads')
@UseGuards(JwtAuthGuard)
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.threadsService.findAllByUser(req.user.userId);
  }
}
