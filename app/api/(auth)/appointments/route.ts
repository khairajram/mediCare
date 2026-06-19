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
    let appointments;
    if (user.role === "admin") {
      appointments = await prisma.appointment.findMany({
        include: {
          user: { select: { id: true, name: true, phoneNo: true, email: true } },
          pet: { select: { id: true, name: true, species: true, breed: true } }
        },
        orderBy: { date: "asc" }
      });
    } else {
      appointments = await prisma.appointment.findMany({
        where: { userId: user.id },
        include: {
          pet: { select: { id: true, name: true, species: true, breed: true } }
        },
        orderBy: { date: "asc" }
      });
    }

    return NextResponse.json({ appointments });
  } catch (err: any) {
    console.error("GET appointments error:", err);
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
    const { petId, type, date, notes } = body;

    const validTypes = ["VET_DOCTOR", "GROOMING_BATHING", "GROOMING_HAIRCUT", "GROOMING_FULL"];
    if (!petId || !type || !date || !validTypes.includes(type)) {
      return NextResponse.json({ message: "Invalid appointment details" }, { status: 400 });
    }

    // Verify pet ownership
    const pet = await prisma.pet.findFirst({
      where: { id: petId, userId: user.id }
    });

    if (!pet) {
      return NextResponse.json({ message: "Pet not found or does not belong to user" }, { status: 404 });
    }

    const appointment = await prisma.$transaction(async (tx) => {
      const created = await tx.appointment.create({
        data: {
          userId: user.id,
          petId,
          type,
          date: new Date(date),
          notes
        },
        include: {
          pet: true
        }
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          action: "APPOINTMENT_BOOKED",
          details: `${type} appointment booked for pet "${pet.name}" on ${new Date(date).toLocaleString()} by user ${user.name || user.id}`,
          performedBy: user.name || "User"
        }
      });

      return created;
    });

    return NextResponse.json({ message: "Appointment booked successfully", appointment }, { status: 201 });
  } catch (err: any) {
    console.error("POST appointment error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
