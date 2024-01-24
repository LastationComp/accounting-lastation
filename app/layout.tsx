import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NUIProvider from './_components/NUIProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Accounting',
  description: 'Accounting By Lastation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + ' h-screen'}>
        <NUIProvider>{children}</NUIProvider>
      </body>
    </html>
  );
}
