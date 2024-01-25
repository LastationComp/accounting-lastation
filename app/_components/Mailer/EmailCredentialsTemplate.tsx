
import { Body, Button, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from '@react-email/components';
import React, { useEffect, useState } from 'react';

interface EmployeeCredentials {
  company_name: string;
  name: string;
  username: string;
  password: string;
  license_key: string;
}
export function EmailCredentialsTemplate({ company_name, username, password, license_key, name }: EmployeeCredentials) {
  return (
    <Html>
      <Head />
      <Preview>Save Your Credentials!</Preview>
      <Tailwind>
        <Body>
          <Container key={'container'} className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section key={'section1'}>
              <h1 className="font-bold text-[12px] mr-auto">Lastation</h1>
            </Section>
            <Heading key={'heading1'} className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              You has been added by {company_name}!
            </Heading>
            <Text key={'text-1'} className="text-black text-[14px] leading-[24px]">
              Hello, {name}.
            </Text>
            <Text key={'text-2'} className="text-black text-[12px] leading-[24px]">
              You will be a <b>Employee of {company_name}</b>. But, please remember or backup this credentials for use <Link href={process.env.NEXT_URL}>Our Web App</Link>.
            </Text>
            <Text key={'text-3'} id="credential-content" className="outline outline-1 outline-slate-400 bg-slate-200 rounded px-5 py-4">
              License Key : {license_key} <br />
              Username : {username} <br />
              Password : {password} <br />
            </Text>
            <Text key={'text-4'} className="text-sm font-thin text-[10px]">
              <b>Note</b>: The <b>License Key</b> will be use while open <Link href={process.env.NEXT_URL}>Our Web App</Link> for the first time.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
