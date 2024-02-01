'use client';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';

interface PosButton {
  href: string;
  icon?: IconProp;
  children: React.ReactNode;
  color?: any;
}

export default function AccButton({ href, icon, children, color = 'default' }: PosButton) {
  const router = useRouter();
  const changeRoute = () => {
    nProgress.start();
    return router.push(href);
  };
  return (
    <Button size={'sm'} color={color} onClick={changeRoute} startContent={icon && <FontAwesomeIcon icon={icon} />}>
      {children}
    </Button>
  );
}
