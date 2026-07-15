import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Gate /admin: require a Supabase session (except login).
 * Staff membership is checked in requireAdmin() / login API (DB + OWNER_EMAIL).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    if (pathname === "/admin/login") return response;
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.searchParams.set("error", "supabase");
    return NextResponse.redirect(login);
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = pathname === "/admin/login";

  if (!user) {
    if (isLogin) return response;
    const login = request.nextUrl.clone();
    login.pathname = "/admin/login";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  // Session exists — pages/API enforce staff via requireAdmin()
  if (isLogin) {
    // Let login page load; client will redirect after successful staff check
    // (we cannot query staff_members reliably without service role in middleware)
    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
