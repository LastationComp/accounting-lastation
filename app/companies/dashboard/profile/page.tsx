import React from 'react';
import FormProfile from './form-profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import NextSessionProvider from '@/app/_components/NextSessionProvider';

export async function generateMetadata() {
  const session = await getServerSession(authOptions);

  return {
    title: 'Profile | ' + session?.user.name,
  };
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  return (
    <section>
      <Card shadow={'sm'}>
        <CardHeader>
          <h1 className="text-lg">Profile Page</h1>
        </CardHeader>
        <CardBody>
          <NextSessionProvider session={session}>
            <FormProfile session={session} />
          </NextSessionProvider>
        </CardBody>
      </Card>
    </section>
  );
}
