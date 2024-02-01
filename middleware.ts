import { NextResponse, type NextRequest } from 'next/server';
import { ValidateAdmin } from './app/_lib/Validator/Admin';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const redirect = (url: string) => {
    const newUrl = new URL(url, req.url);
    return NextResponse.redirect(newUrl);
  };

  const rewrite = (url: string) => {
    const newUrl = new URL(url, req.url);
    return NextResponse.rewrite(newUrl);
  };

  if (pathname.startsWith('/api/admin')) {
    const token = req.headers.get('AUTHORIZATION') ?? '';
    if (!ValidateAdmin({ token: token })) return rewrite('/api/unauthorized');
    return NextResponse.next();
  }

  const cookieName = process.env.NODE_ENV === 'development' ? 'next-auth.session-token' : '__Secure-next-auth.session-token';
  const callbackUrl = process.env.NODE_ENV === 'development' ? 'next-auth.callback-url' : '__Secure-next-auth.callback-url';
  const companyUrl = '/companies/dashboard';
  const employeeUrl = '/employee/dashboard';
  const token = await getToken({ req: req, cookieName: cookieName, secret: process.env.NEXTAUTH_SECRET, secureCookie: true });

  if (pathname === '/' && !token) return NextResponse.next();

  if (token) {
    if (pathname === '/' && token.role === 'company') return redirect(companyUrl);
    if (pathname === '/' && token.role === 'employee') return redirect(employeeUrl);

    if (pathname.startsWith('/companies/dashboard')) {
      if (token.role !== 'company') return redirect('/');
      return NextResponse.next();
    }

    if (pathname.startsWith('/employees/dashboard')) {
      if (token.role !== 'employee') return redirect('/');
      return NextResponse.next();
    }
  }

  return redirect('/');
}

export const config = {
  matcher: ['/api/admin/:path*', '/companies/:path*', '/employees/:path*', '/'],
};
