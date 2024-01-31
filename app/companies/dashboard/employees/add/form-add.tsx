'use client';

import ResponseMsg from '@/app/_components/ResponseMessage';
import { delay } from '@/app/_lib/Handling/Promise';
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import { faAt, faMailBulk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React, { BaseSyntheticEvent, useState } from 'react';

export default function FormAdd({ session }: { session: Session | null }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrMsg('');
    setSuccessMsg('');

    const data = {
      companyId: session?.user.id,
      name: name,
      username: username,
      email: email,
    };

    await delay(1000);

    const res = await fetch('/api/companies/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setIsPending(false);

    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }

    setSuccessMsg('Redirecting... | ' + result?.message);
    await delay(3000);
    return router.push('/companies/dashboard/employees');
  };
  return (
    <Card shadow={'sm'} fullWidth>
      <CardHeader className="md:text-2xl sm:text-sm">Add Employee</CardHeader>
      <CardBody>
        <form action="" method="post" className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {errMsg && <ResponseMsg type={'error'} message={errMsg} />}
          {successMsg && <ResponseMsg type={'success'} message={successMsg} />}
          <Input
            placeholder="Input Employee Username..."
            description={'Ex. : abc_defg123'}
            isRequired
            type="text"
            value={username}
            onValueChange={(val) => setUsername(val)}
            labelPlacement={'outside'}
            startContent={<FontAwesomeIcon icon={faAt} />}
            label="Username"
          />
          <Input placeholder="Input Employee Name..." isRequired type="text" value={name} onValueChange={(val) => setName(val)} labelPlacement={'outside'} startContent={<FontAwesomeIcon icon={faUser} />} label="Name" />
          <Input placeholder="Input Employee Email..." isRequired type="email" value={email} onValueChange={(val) => setEmail(val)} labelPlacement={'outside'} startContent={<FontAwesomeIcon icon={faEnvelope} />} label="Email" />
          <div className="justify-end flex gap-5">
            <Button color={'primary'} type="submit" isLoading={isPending} startContent={<FontAwesomeIcon icon={faPlus} />}>
              Add
            </Button>
            <Button
              onClick={() => {
                nProgress.start();
                return router.back();
              }}
            >
              Back
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
