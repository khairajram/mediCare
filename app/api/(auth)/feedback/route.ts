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
    let feedbacks;
    if (user.role === "admin") {
      feedbacks = await prisma.feedback.findMany({
        include: {
          user: { select: { id: true, name: true, phoneNo: true } }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      feedbacks = await prisma.feedback.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json({ feedbacks });
  } catch (err: any) {
    console.error("GET feedback error:", err);
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
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        rating: parseInt(rating),
        comment
      }
    });

    return NextResponse.json({ message: "Feedback submitted successfully", feedback }, { status: 201 });
  } catch (err: any) {
    console.error("POST feedback error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
