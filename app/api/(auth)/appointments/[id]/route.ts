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

export async function PUT(req: Request, context: { params: any }) {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { pet: true }
    });

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
    }

    // Role check: User can only cancel their own. Admin can do everything.
    if (user.role !== "admin") {
      if (appointment.userId !== user.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (status !== "CANCELLED") {
        return NextResponse.json({ message: "Users can only cancel appointments" }, { status: 403 });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.update({
        where: { id },
        data: { status }
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          action: "APPOINTMENT_STATUS_UPDATED",
          details: `Appointment (${appointment.type}) for pet "${appointment.pet.name}" status updated to ${status} by ${user.role} ${user.name || user.id}`,
          performedBy: user.name || "User"
        }
      });

      return appt;
    });

    return NextResponse.json({ message: "Appointment updated successfully", appointment: updated });
  } catch (err: any) {
    console.error("PUT appointment status error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
