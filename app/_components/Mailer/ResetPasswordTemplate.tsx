import { Body, Button, Column, Container, Head, Heading, Html, Img, Link, Preview, Row, Section, Tailwind, Text } from '@react-email/components';
import React, { useRef, useState } from 'react';

interface ResetPasswordInterface {
  name: string;
  url: string;
}
export function ResetPasswordTemplate({ name, url }: ResetPasswordInterface) {
  return (
    <Html>
      <Head />
      <Preview>Reset Password</Preview>
      <Tailwind>
        <Body>
          <Container key={'container'} className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section key={'section1'}>
              <h1 className="font-bold text-[12px] mr-auto">Lastation</h1>
            </Section>
            <Heading key={'heading1'} className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Need to reset password?
            </Heading>
            <Text key={'text-1'} className="text-black text-[14px] leading-[24px]">
              Hello, {name}.
            </Text>
            <Text key={'text-2'} className="text-black text-[12px] leading-[24px]">
              Please click "Reset Password" button to set your new password.
            </Text>
            <div className="flex justify-center">
              <Button
                href={url}
                style={{
                  backgroundColor: 'rgb(37 99 235)',
                  padding: '0.5rem 1rem',
                  color: 'white',
                  border: '1px solid rgb(37 99 235)',
                  borderRadius: '25px',
                }}
              >
                Reset Password
              </Button>
            </div>
            <Text key={'text-4'} className="text-sm font-thin text-[10px]">
              <b>Note</b>: We can't show your old password for any reason.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
