import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Helper to authenticate user from cookies
function getAuthUser(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string; name?: string };
  } catch (err) {
    return null;
  }
}

export async function GET(req: Request) {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    let tickets;
    if (user.role === "admin") {
      tickets = await prisma.supportTicket.findMany({
        include: {
          user: { select: { id: true, name: true, phoneNo: true, email: true } }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      tickets = await prisma.supportTicket.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json({ tickets });
  } catch (err: any) {
    console.error("GET tickets error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = getAuthUser(req);
  if (!user || user.role !== "user") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { subject, message } = body;

    if (!subject || !message) {
      return NextResponse.json({ message: "Subject and Message are required" }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject,
        message
      }
    });

    return NextResponse.json({ message: "Support ticket created successfully", ticket }, { status: 201 });
  } catch (err: any) {
    console.error("POST ticket error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
