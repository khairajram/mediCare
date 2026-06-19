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
    let orders;
    if (user.role === "admin") {
      orders = await prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, phoneNo: true, email: true } },
          pet: { select: { id: true, name: true, species: true } },
          items: {
            include: {
              medicine: { select: { id: true, name: true, type: true, dose: true, price: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
          pet: { select: { id: true, name: true, species: true } },
          items: {
            include: {
              medicine: { select: { id: true, name: true, type: true, dose: true, price: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    }

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("GET orders error:", err);
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
    const { petId, deliveryAddress, lat, lng, notes, items } = body;

    if (!deliveryAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Invalid order details" }, { status: 400 });
    }

    // Calculate total cost and fetch medicines
    let totalCost = 0;
    const orderItemsData: { medicineId: string; quantity: number; priceAtPurchase: number }[] = [];

    for (const item of items) {
      const { medicineId, quantity } = item;
      if (!medicineId || !quantity || quantity <= 0) {
        return NextResponse.json({ message: "Invalid medicine item" }, { status: 400 });
      }

      const medicine = await prisma.medicine.findUnique({
        where: { id: medicineId }
      });

      if (!medicine) {
        return NextResponse.json({ message: `Medicine with ID ${medicineId} not found` }, { status: 404 });
      }

      // Check stock availability
      if (medicine.quantityInStock < quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${medicine.name}` }, { status: 400 });
      }

      const itemCost = medicine.price * quantity;
      totalCost += itemCost;

      orderItemsData.push({
        medicineId,
        quantity,
        priceAtPurchase: medicine.price
      });
    }

    // Flat delivery fee (can customize based on distance if lat/lng present)
    const deliveryFee = 50.0;
    const finalTotal = totalCost + deliveryFee;

    // Create order inside a transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: user.id,
          petId: petId || null,
          deliveryAddress,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
          deliveryFee,
          totalCost: finalTotal,
          notes,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: true
        }
      });

      // Log activity
      await tx.activityLog.create({
        data: {
          action: "ORDER_CREATED",
          details: `Order of total ₹${finalTotal} created by user ${user.name || user.id}. Status: PENDING`,
          performedBy: user.name || "User"
        }
      });

      return createdOrder;
    });

    return NextResponse.json({ message: "Order placed successfully", order }, { status: 201 });
  } catch (err: any) {
    console.error("POST order error:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}
