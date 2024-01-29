import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      name: string;
      username: string;
      code: string;
      email: string;
      is_active: boolean;
      address: string;
      license_key: string;
      role: string;
      
    };
  }

  interface User {
    name: string;
    username: string;
    code: string;
    is_active: boolean;
    address: string;
    license_key: string;
    role: string;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    idToken?: string;
    name: string;
    username: string;
    code: string;
    is_active: boolean;
    address: string;
    license_key: string;
    role: string;
    email: string;
  }
}
