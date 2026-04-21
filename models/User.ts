import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOTP: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    otpResendCount: {
      type: Number,
      default: 0,
    },
    otpNextResend: {
      type: Date,
    },
    resetOTP: {
      type: String,
    },
    resetOTPExpiry: {
      type: Date,
    },
    otpFailures: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

export const User =
  (models.User as Model<User> | undefined) || model<User>('User', UserSchema);
