'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import React, { BaseSyntheticEvent, useState } from 'react';
import { delay } from '../_lib/Handling/Promise';
import ResponseMsg from '../_components/ResponseMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import AccButton from '../_components/Generator/AccButton';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';

export default function FormResetPassword() {
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    setIsPending(true);
    setErrMsg('');

    await delay(1000);

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: formdata.get('email') ?? '',
      }),
    });

    if (!res.ok && res.status !== 200) {
      const result = await res.json();
      setIsPending(false);
      return setErrMsg(result?.message);
    }

    setIsPending(false);
    const result = await res.json();
    return setSuccessMsg(result?.message);
  };
  return (
    <Card shadow={'sm'}>
      <CardHeader className="text-md font-bold">Reset Password</CardHeader>
      {!successMsg && (
        <form method="post" onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-3 md:w-[400px]">
            {errMsg && <ResponseMsg type={'error'} message={errMsg} />}
            <span className=" text-sm text-black/70">
              We need to know you for resetting password by <b>input your email below</b>. Please make sure your email is active, we will send you reset password notification
            </span>
            <Input type="email" isRequired placeholder="Input your email..." name="email" size={'sm'} label="Email" />
            <Button type="submit" color={'primary'} isLoading={isPending}>
              Submit
            </Button>
          </CardBody>
        </form>
      )}
      {successMsg && (
        <CardBody>
          <ResponseMsg type={'success'} message={successMsg} />
        </CardBody>
      )}
      <CardFooter className="flex w-full">
        <Button
          fullWidth
          startContent={<FontAwesomeIcon icon={faCaretLeft} />}
          onClick={() => {
            nProgress.start();
            router.push('/');
          }}
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
