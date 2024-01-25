import { NextResponse, type NextRequest } from 'next/server';
import { ValidateAdmin } from './app/_lib/Validator/Admin';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const redirect = (url: string) => {
    const newUrl = new URL(url, req.url);
    return NextResponse.redirect(newUrl);
  };

  if (pathname.startsWith('/api/admin')) {
    const token = req.headers.get('AUTHORIZATION') ?? '';
    if (!ValidateAdmin({ token: token })) return redirect('/api/unauthorized');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
