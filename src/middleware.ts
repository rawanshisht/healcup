import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
}

export const config = { matcher: ['/admin/:path*'] }
