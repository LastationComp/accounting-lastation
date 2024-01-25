import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import NUIProvider from './_components/NUIProvider';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import favico from '@/app/favico.ico';
config.autoAddCss = false;
const inter = Poppins({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Accounting',
  description: 'Accounting By Lastation',
  icons: favico.src,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-poslight'}>
        <NUIProvider>{children}</NUIProvider>
      </body>
    </html>
  );
}
