import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Twilio from "twilio";
import bcrypt from "bcryptjs";

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(1),
  phoneNo: z.string().regex(/^\d{10}$/),
  address: z.string(),
  email: z.string(),
});

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, phoneNo: true, address: true },
    });

    return new Response(JSON.stringify({
      message: "all users",
      users,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
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
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({
        message: "Validation error",
        errors: parsed.error.flatten(),
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, phoneNo, address,email } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { phoneNo },
    });

    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(phoneNo, 10);

    const response = await prisma.user.create({
      data: { name, phoneNo, address, email, password : hashedPassword },
    });
 
    await sendMail(name, phoneNo, address,email);

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

async function sendMail(name: string, phoneNo: string, address: string,email : string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Karni Medical" <${process.env.GMAIL_USER}>`,
      to: email, // could also send to the user if you collect email
      subject: `Welcome to Karni Medical, ${name}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2c3e50;">Welcome, ${name}!</h2>
          <p>We’re excited to have you join <strong>Karni Medical</strong>.</p>
          <p>Here’s the information we have on file for you:</p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Phone:</strong> ${phoneNo}</li>
            <li><strong>Address:</strong> ${address}</li>
          </ul>
          <p>If anything looks incorrect, please contact our support team.</p>
          <p style="margin-top:20px;">Thank you for choosing us 💙</p>
          <p>— The Karni Medical Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SendMail error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
