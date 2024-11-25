import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,now } from 'mongoose';

@Schema({ timestamps: true })
export class UserSession extends Document {
  @Prop({ required: true})
  username: string;
  
  @Prop({required: true, unique: true})
  token: string;

  @Prop({required: true, default: now()})
  createdAt: Date;

  @Prop({required: true, default: now()})
  updatedAt: Date;
}

export const UserSessionSchema = SchemaFactory.createForClass(UserSession);
UserSessionSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 3600 }); // Expire 1 hour after updatedAt