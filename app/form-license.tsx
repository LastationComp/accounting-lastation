'use client';

import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import { delay } from './_lib/Handling/Promise';

export default function FormLicense() {
  const [hasLicense, setHasLicense] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [pending, setPending] = useState(false);
  const [license, setLicense] = useState('');

  const checkLicenseKey = async () => {
    setErrMsg('');
    setPending(!pending);
    await delay(1000);

    const storageLicense = localStorage.getItem('license') ?? license;

    const res = await fetch('/api/admin/license', {
      method: 'POST',
      headers: {
        AUTHORIZATION: process.env.NEXT_SECRET ?? '',
      },
      body: JSON.stringify({
        license: storageLicense,
      }),
    });
    const result = await res.json();
    setPending(false);
    if (!res.ok && res.status !== 200) {
      setHasLicense(false);
      return setErrMsg(result?.message);
    }

    setErrMsg('');
    localStorage.setItem('license', storageLicense);
    return setHasLicense(true);
  };
  const onLoadCheckLicense = () => {
    checkLicenseKey();
  };

  useEffect(() => {
    const licenseKey = localStorage.getItem('license');
    if (!licenseKey) return setHasLicense(false);

    onLoadCheckLicense();
  }, []);
  return (
    <Modal isOpen={!hasLicense} onLoadedMetadata={() => console.log('ereds')} isDismissable={false} hideCloseButton placement={'center'}>
      <ModalContent>
        {(onclose) => (
          <>
            <ModalHeader>Input License Key</ModalHeader>
            <ModalBody>
              <div className="flex flex-col">
                {!localStorage.getItem('license') && (
                  <>
                    <span className="text-md font-normal">I think you have a first time to use Our Web App.</span>
                    <span className="text-sm font-normal">Please input your License Key.</span>
                  </>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  checkLicenseKey();
                }}
                method="POST"
              >
                {errMsg && <span className="px-3 py-2 bg-red-500 text-white flex flex-wrap rounded mb-3 text-sm font-thin">{errMsg}</span>}
                <div className="flex flex-col items-center gap-3">
                  {!localStorage.getItem('license') && (
                    <Input
                      size={'sm'}
                      variant={'faded'}
                      autoFocus
                      isRequired
                      value={license}
                      onValueChange={(val) => {
                        setErrMsg('');
                        setLicense(val);
                      }}
                      required
                      name="license"
                      label="License Key"
                      placeholder="Input your license key..."
                      startContent={<FontAwesomeIcon icon={faKey} size={'sm'} />}
                    />
                  )}
                  <Button type="submit" fullWidth color={'primary'} isLoading={pending}>
                    {localStorage.getItem('license') ? 'Refresh License' : 'Submit'}
                  </Button>
                  ;
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
