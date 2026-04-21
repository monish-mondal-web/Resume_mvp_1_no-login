import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { sendVerificationEmail } from '@/utils/mailer';
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
      return apiError('User not found', 404);
    }

    if (user.isVerified) {
      return apiError('User already verified', 400);
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
    if (count === 0)
      delayMinutes = 3; // 2nd Manual Request
    else if (count === 1)
      delayMinutes = 10; // 3rd Manual Request
    else if (count >= 2) delayMinutes = 24 * 60; // 4th Manual Request -> 24 Hr Ban

    const otp = generateOtp();
    const otpExpiry = minutesFromNow(OTP_EXPIRY_MINUTES);
    const otpNextResend = minutesFromNow(delayMinutes);

    await User.updateOne(
      { email },
      {
        $set: {
          verificationOTP: otp,
          otpExpiry,
          otpNextResend,
          otpResendCount: count + 1,
          otpFailures: 0,
        },
      }
    );

    await sendVerificationEmail(email, otp);

    return apiSuccess({
      message: 'OTP sent successfully',
      nextResend: otpNextResend,
    });
  } catch (error) {
    console.error('Resend OTP error', error);
    return apiError('An error occurred', 500);
  }
}
