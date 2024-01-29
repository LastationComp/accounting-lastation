'use client';

import { Button, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react';
import React, { useState } from 'react';
import logo from '@/app/favico.ico';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { delay } from '@/app/_lib/Handling/Promise';

interface NavbarCompany {
  session: Session | null | undefined;
}

export default function NavbarCompanies({ session }: NavbarCompany) {
  const [isPending, setIsPending] = useState(false);
  const logout = async () => {
    setIsPending(true);
    await delay(1000);
    await signOut({
      redirect: true,
    });
  };
  return (
    <Navbar maxWidth={'full'} className="bg-posgray h-[60px] text-white">
      <NavbarBrand className="flex items-center">
        <Image src={logo.src} width={40} height={30} />
        <span>Welcome, {session?.user.name}!</span>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color={'danger'} isLoading={isPending} onClick={logout} variant={'flat'}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
