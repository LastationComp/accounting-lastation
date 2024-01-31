'use client';

import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Tab, Tabs } from '@nextui-org/react';
import React, { useState } from 'react';
import logo from '@/app/favico.ico';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { delay } from '@/app/_lib/Handling/Promise';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { generateShortName } from '@/app/_lib/Generator/ShortNameGenerator';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import nProgress from 'nprogress';
import generateLink from '@/app/_components/Generator/Link';

interface NavbarCompany {
  session: Session | null | undefined;
}

export default function NavbarCompanies({ session }: NavbarCompany) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setIsPending(true);
    await delay(1000);
    await signOut({
      redirect: true,
    });
  };
  return (
    <>
      <Navbar maxWidth={'full'} position={'sticky'} className="bg-posgray text-white">
        <NavbarContent>
          <NavbarItem>
            <Image src={logo.src} width={40} height={30} />
          </NavbarItem>
          <NavbarItem>{generateLink('', 'Home')}</NavbarItem>
          <NavbarItem>{generateLink('/employees', 'Employees')}</NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="flex my-auto">
            <Dropdown trigger={'longPress'} triggerType={'tree'}>
              <DropdownTrigger className="hover:cursor-pointer">
                <Avatar showFallback name={generateShortName(session?.user.name)} />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Menus"
                onAction={(key) => {
                  if (key === 'logout') return logout();
                  if (key === 'profile') {
                    nProgress.start();
                    router.push('/companies/dashboard/profile');
                  }
                }}
              >
                <DropdownSection title={'Login as ' + session?.user.username}>
                  <DropdownItem textValue="Profile" endContent={<FontAwesomeIcon icon={faUser} />} key={'profile'}>
                    Profile
                  </DropdownItem>
                  <DropdownItem textValue="Logout" endContent={<FontAwesomeIcon icon={faRightFromBracket} />} key={'logout'} className="text-danger" color="danger">
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </>
  );
}
