import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type PortfolioDocument = Portfolio & Document;

@Schema({
  timestamps: true, // Automatically adds createdAt and updatedAt fields
})
export class Portfolio {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId!: User;

  @Prop({ required: true })
  stockSymbol!: string;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);

// Create a compound index to prevent duplicate stocks in a user's portfolio
PortfolioSchema.index({ userId: 1, stockSymbol: 1 }, { unique: true });
