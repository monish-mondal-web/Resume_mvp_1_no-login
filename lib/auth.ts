import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { env } from "@/utils/env";
import { sendVerificationEmail } from "@/utils/mailer";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (!user.isVerified) {
          // Check if spamming logins
          if (user.otpNextResend && new Date() < user.otpNextResend) {
            throw new Error(`unverified_email_${user.otpNextResend.toISOString()}`);
          }

          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
          const otpNextResend = new Date(Date.now() + 1 * 60 * 1000);
          
          await User.updateOne(
            { email: user.email },
            { $set: { verificationOTP: otp, otpExpiry, otpNextResend, otpResendCount: 0 } }
          );
          
          await sendVerificationEmail(user.email, otp);
          throw new Error(`unverified_email_${otpNextResend.toISOString()}`);
        }

        return { id: user._id.toString(), email: user.email, name: user.name, isVerified: user.isVerified };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (user.id) {
          token.id = user.id;
        }
        if (typeof user.isVerified === "boolean") {
          token.isVerified = user.isVerified;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id;
        }
        if (typeof token.isVerified === "boolean") {
          session.user.isVerified = token.isVerified;
        }
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || "User",
            image: user.image,
            isVerified: true, // Google users are always verified
          });
          user.isVerified = true;
        } else if (!existingUser.isVerified) {
          // If they signed up with email but never verified, then switch to Google -> verify them
          existingUser.isVerified = true;
          await existingUser.save();
          user.isVerified = true;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: env.NEXTAUTH_SECRET,
};
