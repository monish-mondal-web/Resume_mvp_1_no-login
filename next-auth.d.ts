import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string;
      isVerified?: boolean;
      isProfileCompleted?: boolean;
    };
  }

  interface User extends DefaultUser {
    id?: string;
    isVerified?: boolean;
    isProfileCompleted?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    isVerified?: boolean;
    isProfileCompleted?: boolean;
  }
}
