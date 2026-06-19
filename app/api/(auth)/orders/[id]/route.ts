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
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["PENDING", "PACKING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { medicine: true } } }
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if transition is already done
    if (order.status === status) {
      return NextResponse.json({ message: "Order status is already " + status });
    }

    // Handle inventory update when order is DELIVERED
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update status
      const updated = await tx.order.update({
        where: { id },
        data: { status },
        include: { items: { include: { medicine: true } } }
      });

      // Log status update
      await tx.activityLog.create({
        data: {
          action: "ORDER_STATUS_UPDATED",
          details: `Order status of ${id} updated to ${status} by admin ${user.name || user.id}`,
          performedBy: user.name || "Admin"
        }
      });

      // If status is updated to DELIVERED, decrement inventory levels
      if (status === "DELIVERED") {
        for (const item of updated.items) {
          const newQty = Math.max(0, item.medicine.quantityInStock - item.quantity);

          await tx.medicine.update({
            where: { id: item.medicineId },
            data: { quantityInStock: newQty }
          });

          // Check if low stock threshold crossed
          if (newQty < item.medicine.minimumStockLevel) {
            await tx.activityLog.create({
              data: {
                action: "LOW_STOCK_ALERT",
                details: `Stock for medicine "${item.medicine.name}" has dropped to ${newQty} (Minimum threshold: ${item.medicine.minimumStockLevel})`,
                performedBy: "System"
              }
            });
          }
        }
      }

      return updated;
    });

    return NextResponse.json({ message: "Order updated successfully", order: updatedOrder });
  } catch (err: any) {
    console.error("PUT order status error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
