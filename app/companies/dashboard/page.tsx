import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import MainDashboard from './main-dashboard';

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <section className="h-full container mx-auto">
      <MainDashboard session={session} />
    </section>
  );
}
