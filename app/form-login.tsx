'use client';

import { Card, CardBody, CardHeader, Divider, Image, Input } from '@nextui-org/react';
import React from 'react';
import Icon from '@/public/IconPng.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

export default function FormLogin() {
  return (
    <form action="">
      <Card shadow={'sm'} className="bg-posgray text-white sm:w-[400px]">
        <CardHeader className="flex">
          <h1 className="text-xl font-semibold">Login Page</h1>
        </CardHeader>
        <Divider className="bg-white" />
        <CardBody className="flex flex-col items-center">
          <Image src={Icon.src} width={90} height={100} />
          <h1 className="font-bold text-lg">Welcome to Accounting App</h1>
          <Input
            size={'sm'}
            placeholder="Input your username..."
            className="text-black"
            variant={'faded'}
            fullWidth
            radius={'lg'}
            label="Username"
            labelPlacement={'inside'}
            startContent={<FontAwesomeIcon className="mb-0.5" icon={faUser} size={'sm'} />}
          />
        </CardBody>
      </Card>
    </form>
  );
}
