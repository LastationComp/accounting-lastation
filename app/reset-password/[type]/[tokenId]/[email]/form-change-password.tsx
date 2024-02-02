'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import ResponseMsg from '@/app/_components/ResponseMessage';
import { fetcher } from '@/app/_lib/Handling/Fetcher';
import { delay } from '@/app/_lib/Handling/Promise';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React, { BaseSyntheticEvent, useMemo, useState } from 'react';
import useSWR from 'swr';

interface ChangePasswordType {
  params: {
    type: 'company' | 'employee';
    tokenId: string;
    email: string;
  };
}
export default function FormChangePassword({ params }: ChangePasswordType) {
  const [errMsg, setErrMsg] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();
  const { data, error } = useSWR(`/api/reset-password?token=${params.tokenId}&email=${params.email}`, fetcher, {
    onErrorRetry(err, key, config, revalidate, revalidateOpts) {
      if (err.status === 400) return;
    },
  });

  const tokenId = useMemo(() => {
    return data?.tokenId;
  }, [data]);

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrMsg('');

    const formData = new FormData(e.currentTarget);
    await delay(1000);

    const data = {
      type: params.type,
      newPassword: formData.get('new-password') ?? '',
      rePassword: formData.get('re-password') ?? '',
    };

    const res = await fetch('/api/reset-password/' + tokenId, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.ok && res.status !== 200) {
      const result = await res.json();
      setIsPending(false);
      return setErrMsg(result?.message);
    }

    setIsPending(false);
    const result = await res.json();

    setSuccessMsg(result?.message);

    await delay(3000);

    nProgress.start();
    return router.push('/');
  };

  if (!data && !error)
    return (
      <div className="flex justify-center items-center gap-3">
        <span>Validating...</span>
      </div>
    );

  if (error) return <ResponseMsg type="error" message={error.message} />;

  if (successMsg) return <ResponseMsg type="success" message={successMsg} />;

  return (
    <section className="flex flex-col gap-2">
      {errMsg && <ResponseMsg type="error" message={errMsg} />}
      <span className="text-sm text-black/70">We will set up the new password for you. Please fill the form to continue.</span>
      <form method="post" className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input type="password" isRequired name="new-password" size={'sm'} placeholder="Input your New Password..." label={'New Password'} />
        <Input type="password" isRequired name="re-password" size={'sm'} placeholder="Re Input from New Password..." label={'Re-enter Password'} />
        <Button color="primary" type="submit" isLoading={isPending}>
          Save
        </Button>
      </form>
    </section>
  );
}
