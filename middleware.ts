import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if user is signed in and trying to access auth pages, redirect to home
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // if user is not signed in and trying to access protected pages, redirect to login
  if (!user && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/sign-up') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/', '/login', '/sign-up'],
}
