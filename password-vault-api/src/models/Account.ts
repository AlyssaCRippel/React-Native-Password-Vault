import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  accountId: string;
  userId: mongoose.Types.ObjectId;
  username: string;
  encryptedPassword: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema = new Schema({
  accountId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
AccountSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create compound index for better query performance
AccountSchema.index({ userId: 1, accountId: 1 });
AccountSchema.index({ userId: 1, createdAt: -1 });

export const Account = mongoose.model<IAccount>('Account', AccountSchema);
