import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const publicPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/",
  "/feedback",
];

export default withAuth(
  function middleware(req) {
    // If the user is not authenticated and trying to access a protected route
    if (
      !req.nextauth.token &&
      !publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))
    ) {
      const url = new URL("/login", req.url);
      // Check if there's an existing callbackUrl in the URL
      const existingCallbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      // Set callbackUrl to existing one or default to /admin/dashboard
      url.searchParams.set(
        "callbackUrl",
        existingCallbackUrl || "/admin/dashboard/profile"
      );
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages without token
        if (publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
          return true;
        }
        // Require token for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
