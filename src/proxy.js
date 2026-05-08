// import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function proxy(request) {
  // Initialize response
  let supabaseResponse = NextResponse.next({
    request,
  })
  

  // 1. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Set on the request so the current middleware execution can see them
          cookiesToSet.forEach(({ name, value, options }) => 
            request.cookies.set(name, value))
          
          // 2. Initialize the Response
          supabaseResponse = NextResponse.next({
            request,
          })

          // 3. Set on the response so the browser receives the updated cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Fetch User - Use getUser() for server-side validation
  const { data, error } = await supabase.auth.getUser()
  const user = data.user;
  
  const role = user?.user_metadata?.role
  const pathname = request.nextUrl.pathname

 
  




  // --- PROTECTION LOGIC ---

  // A. Protect Teacher Routes
  if (pathname.startsWith('/teacher')) {
    if (!user || role !== 'teacher') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // B. Protect Principal Routes
  if (pathname.startsWith('/principal')) {
    if (!user || role !== 'principal') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // C. Avoid Login Loop
  // If user is logged in and tries to access the home page, send them to their dashboard
  if (pathname === '/' && user && role) {
    return NextResponse.redirect(new URL(`/${role}`, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',

  ],
}