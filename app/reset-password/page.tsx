import React from 'react';
import dynamic from 'next/dynamic';

const FormResetPassword = dynamic(() => import('./form-reset-password'), { ssr: false });
export default function Page() {
  return (
    <section className="flex h-screen items-center justify-center p-3">
      <FormResetPassword />
    </section>
  );
}
