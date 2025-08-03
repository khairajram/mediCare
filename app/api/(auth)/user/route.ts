import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  phoneNo: z.string().regex(/^\d{10}$/),
});

const prisma = new PrismaClient();

export async function GET(req : Request){

  try{
    const users = await prisma.user.findMany({
      select : {
        id : true,
        name : true,
        phoneNo : true,
      }
    })

    return new Response(JSON.stringify({
      "message" : "all users",
      users
      }),
      {
          status: 200,
          headers: { "Content-Type": "application/json" },
      }
    )
  }catch(err : any){
    console.error("get user error:", err);

    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: err.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function PUT(req: Request) {
  try {
    const body =  await req.json();

    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({
        message: "Validation error",
        errors: parsed.error
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { name, phoneNo } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { phoneNo },
    });

    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await prisma.user.create({
      data: {
        name,
        phoneNo
      },
    });

    return new Response(JSON.stringify({
      message: "User created",
      user: response,
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Create user error:", err);

    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: err.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
