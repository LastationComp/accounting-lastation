'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import nProgress from 'nprogress';
import React, { useEffect } from 'react';

export default function Loader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    nProgress.done();
  }, [pathname, router]);
  return (
    <div>
      <NextTopLoader showSpinner={false} initialPosition={0.6} crawl speed={200} />
      {children}
    </div>
  );
}
