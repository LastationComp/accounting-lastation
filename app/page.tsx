import Image from 'next/image';
import FormLogin from './form-login';
import FormLicense from './form-license';

export default function Home() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <FormLicense />
      <FormLogin />
    </main>
  );
}
