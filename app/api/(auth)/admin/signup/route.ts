import { prisma } from "@/lib/prisma"; 
import { z } from "zod";
import bcrypt from "bcryptjs";



export async function POST(req: Request) {
  try {
    const schema = z.object({
      name: z.string(),
      email: z.string().email("Invalid email format"),
      phoneNo: z.string().regex(/^\d{10}$/),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({
        message: "Invalid input data",
        error: parsed.error.format(),
      }), { status: 400 });
    }

    const data = parsed.data;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = await prisma.admin.create({
      data: {
        name: data.name,
        phoneNo: data.phoneNo,
        email: data.email,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify({
      message: "Admin created",
      admin: {
        id: admin.id,
        name: admin.name,
        phoneNo: admin.phoneNo,
        email: admin.email
      },
    }), { status: 201,
          headers: { "Content-Type": "application/json" }
     });

  } catch (err: any) {
    if (err.code === "P2002") {
      return new Response(JSON.stringify({
        message: "Duplicate entry. Email or Phone number already exists",
      }), { status: 409 });
    }
    return new Response(JSON.stringify({
      message: "Internal server error",
      error: err.message,
    }), { status: 500 });
  }
}
