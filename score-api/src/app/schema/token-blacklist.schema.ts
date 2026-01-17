import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenBlacklistDocument = TokenBlacklist & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'tokenBlacklist',
})
export class TokenBlacklist {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const TokenBlacklistSchema = SchemaFactory.createForClass(TokenBlacklist);

// Create TTL index to automatically remove expired tokens
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
