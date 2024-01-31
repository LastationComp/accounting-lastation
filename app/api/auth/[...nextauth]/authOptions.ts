import prisma from '@/app/_lib/Prisma/Client';
import { NextAuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      return {
        ...token,
        ...user,
      };
    },
    session({ session, token }) {
      session.user = token;

      return session;
    },
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
        role: { label: 'Role', type: 'text' },
        license_key: { label: 'license_key', type: 'text' },
      },
      async authorize(credentials, req) {
        const checkUser: any = await prisma.$queryRaw`SELECT * FROM accounting.users WHERE username = ${credentials?.username} AND role = ${credentials?.role}`;

        if (!checkUser[0].username) return null;

        if (checkUser[0].license_key !== credentials?.license_key) return null;

        if (!checkUser[0].is_active) return null;

        const passwordMatch = await bcrypt.compare(credentials?.password ?? '', checkUser[0].password);

        if (!passwordMatch) return null;

        await prisma.$disconnect();

        const user: User = checkUser[0];

        return user;
      },
    }),
  ],
};
