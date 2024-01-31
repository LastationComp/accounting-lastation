import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import dynamic from 'next/dynamic';

const EmployeesDashboard = dynamic(() => import('./employees-dashboard'), { ssr: false });

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <EmployeesDashboard session={session} />;
}
