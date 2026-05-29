export function proxy(request: Request) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/shop")) {
    const cookie = request.headers.get("cookie") ?? "";
    if (!cookie.includes("better-auth.session_token=")) {
      return Response.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/shop/:path*"],
};
