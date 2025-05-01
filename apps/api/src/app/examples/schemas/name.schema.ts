import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NameDocument = Name & Document;

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Name {
  @Prop({ required: true })
  name!: string; // The ! operator is a non-null assertion to tell TypeScript this will be initialized
}

export const NameSchema = SchemaFactory.createForClass(Name);
