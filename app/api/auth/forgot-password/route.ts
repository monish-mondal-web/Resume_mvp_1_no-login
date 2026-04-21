import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendPasswordResetEmail } from '@/utils/mailer';
import { apiError, apiSuccess, parseJsonBody } from '@/lib/api-response';
import { generateOtp, minutesFromNow, OTP_EXPIRY_MINUTES } from '@/lib/otp';
import { emailSchema } from '@/lib/validation/auth';

export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req, emailSchema);
    if (parsed.response) {
      return parsed.response;
    }

    const { email } = parsed.data;

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user) {
      return apiSuccess({
        message: 'If your email is registered, you will receive a reset OTP.',
      });
    }

    if (user.otpNextResend && new Date() < user.otpNextResend) {
      return apiError('Please wait before requesting another code', 429, {
        nextResend: user.otpNextResend,
      });
    }

    let count = user.otpResendCount || 0;
    if (count >= 3 && user.otpNextResend && new Date() > user.otpNextResend) {
      count = 0;
    }

    let delayMinutes = 1;
    if (count === 1) delayMinutes = 3;
    else if (count === 2) delayMinutes = 10;
    else if (count >= 3) delayMinutes = 24 * 60;

    const otp = generateOtp();
    const resetOTPExpiry = minutesFromNow(OTP_EXPIRY_MINUTES);
    const otpNextResend = minutesFromNow(delayMinutes);

    await User.updateOne(
      { email },
      {
        $set: {
          resetOTP: otp,
          resetOTPExpiry,
          otpNextResend,
          otpResendCount: count + 1,
          otpFailures: 0,
        },
      }
    );

    await sendPasswordResetEmail(email, otp);

    return apiSuccess({
      message: 'If your email is registered, you will receive a reset OTP.',
      nextResend: otpNextResend,
    });
  } catch (error) {
    console.error('Forgot Password error', error);
    return apiError('An error occurred', 500);
  }
}
