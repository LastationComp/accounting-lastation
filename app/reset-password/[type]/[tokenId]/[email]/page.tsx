import React from 'react';
import FormChangePassword from './form-change-password';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';

interface ChangePasswordType {
  params: {
    type: 'company' | 'employee';
    tokenId: string;
    email: string;
  };
}

export default function Page({ params }: ChangePasswordType) {
  return (
    <section className="flex h-screen justify-center items-center p-3">
      <Card className="md:w-[400px]">
        <CardHeader>Reset Password</CardHeader>
        <CardBody>
          <FormChangePassword params={params} />
        </CardBody>
      </Card>
    </section>
  );
}
