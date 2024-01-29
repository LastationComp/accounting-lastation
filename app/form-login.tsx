'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, CheckboxGroup, Chip, Divider, Image, Input } from '@nextui-org/react';
import React, { BaseSyntheticEvent, useState } from 'react';
import Icon from '@/public/IconPng.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCircleCheck, faUser } from '@fortawesome/free-regular-svg-icons';
import { faClockRotateLeft, faLock } from '@fortawesome/free-solid-svg-icons';
import { signIn } from 'next-auth/react';
import ResponseMsg from './_components/ResponseMessage';
import { useRouter } from 'next/navigation';
import { delay } from './_lib/Handling/Promise';
export default function FormLogin() {
  const [isResetLicense, setIsSetLicense] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [role, setRole] = useState('employee');
  const router = useRouter();
  const resetLicenseKey = () => {
    localStorage.removeItem('license');
    setIsSetLicense(true);

    window.location.reload();
  };

  const authentication = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrMsg('')
    const formData = new FormData(e.currentTarget);

    await delay(1000);
    const res = await signIn('credentials', {
      username: formData.get('username') ?? '',
      password: formData.get('password') ?? '',
      license_key: localStorage.getItem('license') ?? '',
      role: role,
      callbackUrl: process.env.NEXTAUTH_URL,
      redirect: false,
    });

    if (!res?.ok && res?.status !== 200) {
      setIsPending(false);
      return setErrMsg('Username or Password is Wrong!');
    }

    if (role === 'company') return router.push('companies/dashboard');

    if (role === 'employee') return router.push('employees/dashboard');
  };

  return (
    <Card shadow={'sm'} className="bg-posgray text-white sm:w-[400px]">
      <form onSubmit={authentication} method="POST">
        <CardBody className="flex flex-col items-center gap-5">
          <Image src={Icon.src} width={90} height={100} />
          <h1 className="font-bold text-lg">Welcome to Accounting App</h1>
          {errMsg && <ResponseMsg type="error">{errMsg}</ResponseMsg>}
          <Input
            size={'sm'}
            name="username"
            autoFocus
            placeholder="Input your username..."
            className="text-black"
            variant={'faded'}
            fullWidth
            isRequired
            radius={'lg'}
            label="Username"
            labelPlacement={'inside'}
            startContent={<FontAwesomeIcon className="mb-0.5" icon={faUser} size={'sm'} />}
          />
          <Input
            size={'sm'}
            placeholder="Input your password..."
            name="password"
            className="text-black"
            variant={'faded'}
            fullWidth
            isRequired
            radius={'lg'}
            label="Password"
            labelPlacement={'inside'}
            startContent={<FontAwesomeIcon className="mb-0.5" icon={faLock} size={'sm'} />}
          />
          <div className="flex justify-center gap-5">
            <Checkbox value={'employee'} size={'sm'} isSelected={role === 'employee'} onValueChange={() => setRole('employee')} disableAnimation classNames={{ label: 'text-white' }}>
              Employee
            </Checkbox>
            <Checkbox value={'company'} size="sm" isSelected={role === 'company'} onValueChange={() => setRole('company')} classNames={{ label: 'text-white' }} disableAnimation>
              Company
            </Checkbox>
          </div>
          <Button type="submit" color={'primary'} fullWidth isLoading={isPending}>
            LOGIN
          </Button>
          <Chip color={isResetLicense ? 'success' : 'warning'} onClick={resetLicenseKey} className="hover:cursor-pointer flex" variant="flat">
            <FontAwesomeIcon icon={isResetLicense ? faCircleCheck : faClockRotateLeft} />
            <span className="mx-1">{isResetLicense ? 'Successfully Reset!' : 'Reset License Key'}</span>
          </Chip>
        </CardBody>
      </form>
      <CardFooter>
        <span className="text-[10px]">&copy; 2024 Lastation, Inc. All rights reserved.</span>
      </CardFooter>
    </Card>
  );
}
