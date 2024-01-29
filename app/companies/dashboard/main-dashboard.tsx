'use client';

import { Session } from 'next-auth';
import React from 'react';

interface MainDashboardType {
  session: Session | null | undefined;
}

export default function MainDashboard({ session }: MainDashboardType) {
  return (
    <section className="flex items-center justify-center h-full">
      <div>
        Welcome <span className="font-bold">{session?.user.name}</span> to Our Dashboard.
      </div>
    </section>
  );
}
