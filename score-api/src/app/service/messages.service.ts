import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schema/message.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async findByThread(threadId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ threadId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async create(threadId: string, userId: string, content: string, sender: 'user' | 'bot', metadata?: any): Promise<MessageDocument> {
    const message = new this.messageModel({
      threadId,
      userId,
      content,
      sender,
      metadata,
    });
    return message.save();
  }
}