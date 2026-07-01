import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ObjectDocument = ObjectEntity & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ObjectEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  imageKey: string;

  createdAt: Date;
}

export const ObjectSchema = SchemaFactory.createForClass(ObjectEntity);