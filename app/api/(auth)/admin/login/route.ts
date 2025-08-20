import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phoneNo, password } = await req.json();

    const admin = await prisma.admin.findUnique({
      where: { phoneNo },
    });

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin.id, phoneNo: admin.phoneNo, role: "admin" },
      process.env.JWT_SECRET!
    );

    // create response
    const response = NextResponse.json({
      message: "Login successful",
      admin: { id: admin.id, name: admin.name, phoneNo: admin.phoneNo }
    });

    // set JWT as cookie
    response.cookies.set("token", token, {
      httpOnly: true, // can't be accessed by JS
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (err: any) {
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
