import React from 'react';
import FormAdd from './form-add';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <section className=' flex my-5 justify-center items-center'>
      <FormAdd session={session} />
    </section>
  );
}
