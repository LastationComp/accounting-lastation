import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import NavbarCompanies from './navbar-companies';
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <section className="h-screen">
      <NavbarCompanies session={session} />
      {children}
    </section>
  );
}
