import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import Twilio from "twilio";

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const userSchema = z.object({
  name: z.string().min(1),
  phoneNo: z.string().regex(/^\d{10}$/),
  address : z.string()
});

const prisma = new PrismaClient();

export async function GET(req : Request){

  try{
    const users = await prisma.user.findMany({
      select : {
        id : true,
        name : true,
        phoneNo : true,
        address : true
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


export async function POST(req: Request) {
  try {
    const body =  await req.json();

    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({
        message: "Validation error",
        errors: parsed.error.flatten()
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { name, phoneNo ,address } = parsed.data;

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
        phoneNo,
        address
      },
    });

    sendWelcomeSMS(phoneNo, name);

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

async function sendWelcomeSMS(phoneNo: string, userName: string) {
  try {
    await client.messages.create({
      to: phoneNo,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `Hello ${userName}! Thank you for registering at Shree Karni Medical & Pet Care Center. We’re happy to have you and your pet with us!`,
    });
  } catch (err: any) {
    console.error("Error sending SMS:", err.message);
  }
}



