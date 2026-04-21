import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendVerificationEmail } from '@/utils/mailer';
import { apiError, apiSuccess, parseJsonBody } from '@/lib/api-response';
import { generateOtp, minutesFromNow, OTP_EXPIRY_MINUTES } from '@/lib/otp';
import { registerSchema } from '@/lib/validation/auth';

export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, registerSchema);
    if (parsed.response) {
      return parsed.response;
    }

    const { email, name, password } = parsed.data;

    await dbConnect();

    const existingUser = await User.findOne({ email });

    const otp = generateOtp();
    const otpExpiry = minutesFromNow(OTP_EXPIRY_MINUTES);
    const otpNextResend = minutesFromNow(1);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      if (existingUser.isVerified) {
        return apiError('User already exists', 409);
      } else {
        if (
          existingUser.otpNextResend &&
          new Date() < existingUser.otpNextResend
        ) {
          return apiError('Rate limit active', 429, {
            nextResend: existingUser.otpNextResend,
          });
        }

        await User.updateOne(
          { email },
          {
            $set: {
              verificationOTP: otp,
              otpExpiry,
              otpNextResend,
              otpResendCount: 0,
              otpFailures: 0,
              name,
              password: hashedPassword,
            },
          }
        );

        await sendVerificationEmail(email, otp);
        return apiSuccess(
          { message: 'Verification email resent', nextResend: otpNextResend },
          201
        );
      }
    }

    await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOTP: otp,
      otpExpiry,
      otpNextResend,
      otpResendCount: 0,
      otpFailures: 0,
    });

    await sendVerificationEmail(email, otp);

    return apiSuccess(
      { message: 'User created, OTP sent', nextResend: otpNextResend },
      201
    );
  } catch (error) {
    console.error('Error creating user', error);
    return apiError(
      'An error occurred during registration. Please try again.',
      500
    );
  }
}
