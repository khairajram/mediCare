import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // get cookie safely

  // ✅ No token → just allow them to stay on `/`
  if (!token) {
    return NextResponse.next();
  }

  try {
    // ✅ Verify JWT
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // ✅ Check role and redirect
    if (decoded.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (decoded.role === "user") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
  } catch (err) {
    // If token is invalid/expired → clear cookie and allow access to `/`
    const response = NextResponse.next();
    response.cookies.set("token", "", { maxAge: -1 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // apply only on homepage
};
