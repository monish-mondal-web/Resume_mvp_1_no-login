import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { apiError, apiSuccess, parseJsonBody } from '@/lib/api-response';
import { resetPasswordSchema } from '@/lib/validation/auth';

export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, resetPasswordSchema);
    if (parsed.response) {
      return parsed.response;
    }

    const { email, otp, newPassword } = parsed.data;

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return apiError('Invalid request', 400);
    }

    if (user.otpFailures >= 5) {
      return apiError(
        'Too many failed attempts. Please request a new reset code.',
        429
      );
    }

    if (!user.resetOTP || user.resetOTP !== otp) {
      await User.updateOne({ email }, { $inc: { otpFailures: 1 } });
      return apiError('Invalid or expired reset code', 400);
    }

    if (!user.resetOTPExpiry || new Date() > user.resetOTPExpiry) {
      return apiError('Reset code has expired', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      {
        $set: { password: hashedPassword, otpFailures: 0 }, // Reset on success
        $unset: { resetOTP: 1, resetOTPExpiry: 1 },
      }
    );

    return apiSuccess({ message: 'Password successfully reset!' });
  } catch (error) {
    console.error('Reset Password error', error);
    return apiError('An error occurred during password reset', 500);
  }
}
