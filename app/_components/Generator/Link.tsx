'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function generateLink(href: string, title: string) {
  const pathname = usePathname();
  const realPath = '/companies/dashboard' + href;
  const changeRoute = () => {
    if (!href && pathname === '/companies/dashboard') return 'underline text-posblue';
    if (href && pathname.startsWith(realPath)) return 'underline text-posblue';

    return 'hover:underline hover:text-posblue focus:underline focus:text-posblue transition';
  };
  return (
    <Link href={realPath} className={changeRoute()}>
      {title}
    </Link>
  );
}
