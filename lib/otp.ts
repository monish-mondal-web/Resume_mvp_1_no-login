import 'server-only';

import { randomInt } from 'crypto';

export const OTP_EXPIRY_MINUTES = 15;
export const DEFAULT_RESEND_DELAY_MINUTES = 1;

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
