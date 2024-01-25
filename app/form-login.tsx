'use client';

import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, CheckboxGroup, Chip, Divider, Image, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import Icon from '@/public/IconPng.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCircleCheck, faUser } from '@fortawesome/free-regular-svg-icons';
import { faClockRotateLeft, faLock } from '@fortawesome/free-solid-svg-icons';

export default function FormLogin() {
  const [isResetLicense, setIsSetLicense] = useState(false);
  const [role, setRole] = useState('employee');
  const resetLicenseKey = () => {
    localStorage.removeItem('license');
    setIsSetLicense(true);

    window.location.reload();
  };
  return (
    <form action="">
      <Card shadow={'sm'} className="bg-posgray text-white sm:w-[400px]">
        <CardBody className="flex flex-col items-center gap-5">
          <Image src={Icon.src} width={90} height={100} />
          <h1 className="font-bold text-lg">Welcome to Accounting App</h1>
          <Input
            size={'sm'}
            autoFocus
            placeholder="Input your username..."
            className="text-black"
            variant={'faded'}
            fullWidth
            radius={'lg'}
            label="Username"
            labelPlacement={'inside'}
            startContent={<FontAwesomeIcon className="mb-0.5" icon={faUser} size={'sm'} />}
          />
          <Input
            size={'sm'}
            placeholder="Input your password..."
            className="text-black"
            variant={'faded'}
            fullWidth
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
          <Button fullWidth>LOGIN</Button>
          <Chip color={isResetLicense ? 'success' : 'warning'} onClick={resetLicenseKey} className="hover:cursor-pointer flex" variant="flat">
            <FontAwesomeIcon icon={isResetLicense ? faCircleCheck : faClockRotateLeft} />
            <span className="mx-1">{isResetLicense ? 'Successfully Reset!' : 'Reset License Key'}</span>
          </Chip>
        </CardBody>
        <CardFooter>
          <span className="text-[10px]">&copy; 2024 Lastation, Inc. All rights reserved.</span>
        </CardFooter>
      </Card>
    </form>
  );
}
