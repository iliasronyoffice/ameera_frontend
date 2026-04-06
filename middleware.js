import { NextResponse } from "next/server";

export function middleware(request) {

  const { pathname } = request.nextUrl;
  
  if (pathname === '/admin' || pathname === '/login') {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  }

  
}