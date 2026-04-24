import 'server-only';

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { env } from '@/utils/env';
import { sendVerificationEmail } from '@/utils/mailer';
import { generateOtp, minutesFromNow, OTP_EXPIRY_MINUTES } from '@/lib/otp';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const email = credentials.email.toLowerCase().trim();

        await dbConnect();

        const user = await User.findOne({ email });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        if (!user.isVerified) {
          // Check if spamming logins
          if (user.otpNextResend && new Date() < user.otpNextResend) {
            throw new Error(
              `unverified_email_${user.otpNextResend.toISOString()}`
            );
          }

          const otp = generateOtp();
          const otpExpiry = minutesFromNow(OTP_EXPIRY_MINUTES);
          const otpNextResend = minutesFromNow(1);

          await User.updateOne(
            { email: user.email },
            {
              $set: {
                verificationOTP: otp,
                otpExpiry,
                otpNextResend,
                otpResendCount: 0,
              },
            }
          );

          await sendVerificationEmail(user.email, otp);
          throw new Error(`unverified_email_${otpNextResend.toISOString()}`);
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          isProfileCompleted: user.isProfileCompleted,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (user.id) {
          token.id = user.id;
        }
        if (typeof user.isVerified === 'boolean') {
          token.isVerified = user.isVerified;
        }
        if (typeof user.isProfileCompleted === 'boolean') {
          token.isProfileCompleted = user.isProfileCompleted;
        }
      }

      if (trigger === 'update' && session?.isProfileCompleted !== undefined) {
        token.isProfileCompleted = session.isProfileCompleted;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id;
        }
        if (typeof token.isVerified === 'boolean') {
          session.user.isVerified = token.isVerified;
        }
        if (typeof token.isProfileCompleted === 'boolean') {
          session.user.isProfileCompleted = token.isProfileCompleted;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email?.toLowerCase().trim();

        if (!email) {
          return false;
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          const newUser = await User.create({
            email,
            name: user.name || 'User',
            image: user.image,
            isVerified: true,
            isProfileCompleted: false,
          });
          user.id = newUser._id.toString();
          user.isVerified = true;
          user.isProfileCompleted = false;
        } else {
          if (!existingUser.isVerified) {
            existingUser.isVerified = true;
            await existingUser.save();
          }
          user.id = existingUser._id.toString();
          user.isVerified = true;
          user.isProfileCompleted = existingUser.isProfileCompleted;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: env.NEXTAUTH_SECRET,
};
