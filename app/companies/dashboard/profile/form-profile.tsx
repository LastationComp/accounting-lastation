'use client';

import ResponseMsg from '@/app/_components/ResponseMessage';
import { fetcher } from '@/app/_lib/Handling/Fetcher';
import { delay } from '@/app/_lib/Handling/Promise';
import { submitValidate } from '@/app/_lib/Validator/Form';
import { faCaretLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Input, Skeleton, Textarea } from '@nextui-org/react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

export default function FormProfile({ session }: { session: Session | null }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [oldPasword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, setIsPending] = useState(false);

  const id = session?.user.id;
  const { data } = useSWR(`/api/companies/${id}/profile`, fetcher);
  const { update } = useSession();
  const formValidated = useMemo(
    () =>
      submitValidate(
        ['username', 'address', 'name', 'old_password', 'new_password', 're_password', 'email'],
        {
          ...data?.profile,
          old_password: '',
          new_password: '',
          re_password: '',
        },
        {
          username: username,
          address: address,
          name: name,
          old_password: oldPasword,
          new_password: newPassword,
          re_password: rePassword,
          email: email,
        }
      ),
    [username, address, name, data, oldPasword, newPassword, rePassword, email]
  );

  const clearForm = () => {
    setIsPending(false);
    setErrMsg('');
    setSuccessMsg('');
    setOldPassword('');
    setNewPassword('');
    setRePassword('');
  };

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setErrMsg('');
    setSuccessMsg('');
    setIsPending(true);
    await delay(1000);

    const data = {
      name: name,
      address: address,
      username: username,
      email: email,
      old_password: oldPasword,
      new_password: newPassword,
      re_enter_password: rePassword,
    };

    const res = await fetch(`/api/companies/${id}/profile`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!res.ok && res.status !== 200) {
      const result = await res.json();
      clearForm();
      return setErrMsg(result?.message);
    }

    await update({
      name: name,
      username: username,
    });
    clearForm();
    setEmail(email);
    // setSuccessMsg('Profile successfully saved! Redirecting to home...');

    // await delay(1000);
    return router.push('/companies/dashboard');
  };

  useEffect(() => {
    setName(data?.profile?.name);
    setUsername(data?.profile?.username);
    setAddress(data?.profile?.address);
    setEmail(data?.profile?.email);
  }, [data]);

  return (
    <section className="flex flex-col ">
      {errMsg && <ResponseMsg type="error" message={errMsg} />}
      {successMsg && <ResponseMsg type="success" message={successMsg} />}
      <form onSubmit={handleSubmit} method="post" className="grid grid-cols-2 gap-4 mt-3">
        <Skeleton className="rounded max-md:col-span-2 p-1" isLoaded={data}>
          <Input type="text" name="code" description="You can't change this." value={session?.user.code} isReadOnly size={'sm'} placeholder="Input your code..." label="Company Code" />
        </Skeleton>
        <Skeleton className="rounded max-md:col-span-2 p-1" isLoaded={data}>
          <Input type="email" name="email" isRequired value={email} onValueChange={(val) => setEmail(val)} size={'sm'} placeholder="Input your email..." label="Email" />
        </Skeleton>
        <Skeleton className="rounded col-span-2 p-1" isLoaded={data}>
          <Input type="text" name="username" value={username} onValueChange={(e) => setUsername(e)} isRequired size={'sm'} placeholder="Input your username..." label="Username" />
        </Skeleton>
        <Skeleton className="rounded max-md:col-span-2 p-1" isLoaded={data}>
          <Input type="text" isRequired name="name" value={name} onValueChange={(val) => setName(val)} size={'sm'} placeholder="Input your name..." label="Name" />
        </Skeleton>
        <Skeleton className="rounded max-md:col-span-2 p-1" isLoaded={data}>
          <Textarea maxRows={2} name="address" value={address} onValueChange={(val) => setAddress(val)} isRequired placeholder="Input your address..." label="Address" />
        </Skeleton>

        <div className="col-span-2">
          <Skeleton className="rounded p-1" isLoaded={data}>
            <div className="flex max-md:flex-col gap-3">
              <Input type="password" name="old-password" value={oldPasword} onValueChange={(val) => setOldPassword(val)} size={'sm'} placeholder="Input here..." label="Old Password" />
              <Input type="password" name="new-password" value={newPassword} onValueChange={(val) => setNewPassword(val)} size={'sm'} placeholder="Input here..." label="New Password" />
              <Input type="password" name="re-password" value={rePassword} onValueChange={(val) => setRePassword(val)} size={'sm'} placeholder="Input here..." label="Re-enter New Password" />
            </div>
          </Skeleton>
          <Skeleton className="rounded w-1/4 my-1 w-full" isLoaded={data}>
            <span className="text-sm text-black/60">Note : Insert all password form if you want to change password.</span>
          </Skeleton>
        </div>
        <div className="col-span-2 flex justify-end gap-3">
          <Button color="primary" type="submit" startContent={<FontAwesomeIcon icon={faPlus} />} isDisabled={formValidated} isLoading={isPending}>
            Save
          </Button>
          <Button onClick={() => router.back()} startContent={<FontAwesomeIcon icon={faCaretLeft} />}>
            Back
          </Button>
        </div>
      </form>
    </section>
  );
}
