import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from '../schema/thread.schema';

@Injectable()
export class ThreadsService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
  ) {}

  async findAllByUser(userId: string): Promise<ThreadDocument[]> {
    return this.threadModel
      .find({ userId, isActive: true })
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async create(userId: string, title: string): Promise<ThreadDocument> {
    const thread = new this.threadModel({
      userId,
      title,
      lastMessageAt: new Date(),
    });
    return thread.save();
  }

  async updateLastMessage(threadId: string): Promise<void> {
    await this.threadModel.findByIdAndUpdate(threadId, {
      lastMessageAt: new Date(),
    });
  }
}