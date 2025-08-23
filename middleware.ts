import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload; // contains decoded data like { id, role, ... }
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("🔥 Pathname:", pathname);

  const token = request.cookies.get("token")?.value;
  console.log("🔑 Token:", token ? "Found" : "Missing");

  if (!token) {
    if (pathname === "/admin/login" || pathname === "/login" || pathname === "/" ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const decoded: any = await verifyJWT(token);
  if (!decoded) {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("token", "", { maxAge: -1 });
    return response;
  }

  console.log("✅ Decoded token:", decoded);

  // Already logged in → block access to login pages
  if (pathname === "/admin/login" || pathname === "/login") {
    if (decoded.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (decoded.role === "user") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // Root redirect
  if (pathname === "/") {
    if (decoded.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (decoded.role === "user") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  // Role protection
  if (pathname.startsWith("/admin") && decoded.role !== "admin") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  if (pathname.startsWith("/home") && decoded.role !== "user") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/login", "/admin/login", "/admin/:path*", "/home/:path*"],
};
