import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';
import React from 'react';
import dynamic from 'next/dynamic';

const MainDashboard = dynamic(() => import('./main-dashboard'), { ssr: false });

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <div className="">
      <MainDashboard session={session} />
    </div>
  );
}
