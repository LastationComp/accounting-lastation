import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';
import React from 'react';

const NavbarCompanies = dynamic(() => import('./navbar-companies'), { ssr: false });
export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <section className="h-screen">
      <NavbarCompanies session={session} />
      <section className='container mx-auto p-2'>{children}</section>
    </section>
  );
}
