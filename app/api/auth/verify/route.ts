import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { apiError, apiSuccess, parseJsonBody } from '@/lib/api-response';
import { verifyOtpSchema } from '@/lib/validation/auth';

export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, verifyOtpSchema);
    if (parsed.response) {
      return parsed.response;
    }

    const { email, otp } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return apiError('User not found', 404);
    }

    if (user.isVerified) {
      return apiError('User already verified', 400);
    }

    if (user.otpFailures >= 5) {
      return apiError(
        'Too many failed attempts. Please request a new code.',
        429
      );
    }

    if (user.verificationOTP !== otp) {
      await User.updateOne({ email }, { $inc: { otpFailures: 1 } });
      return apiError('Invalid verification code', 400);
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return apiError('Verification code has expired', 400);
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiry = undefined;
    user.otpNextResend = undefined;
    user.otpResendCount = 0;
    user.otpFailures = 0; // Reset failures on success
    await user.save();

    return apiSuccess({ message: 'Email successfully verified!' });
  } catch (error) {
    console.error('Verification error', error);
    return apiError('An error occurred during verification', 500);
  }
}
