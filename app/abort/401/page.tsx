'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page() {
  const router = useRouter();
  return (
    <section className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-[24px] font-bold">Unauthorized!</h1>
      <span className="text-sm">
        Owh, sorry. you can't access this page. please <span onClick={() => router.back()} className='text-blue-600 hover:cursor-pointer underline'>click here</span> to back
      </span>
    </section>
  );
}
