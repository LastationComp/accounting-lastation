'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function NUIProvider({ children }: { children: React.ReactNode }) {

  return <NextUIProvider>{children}</NextUIProvider>;
}
