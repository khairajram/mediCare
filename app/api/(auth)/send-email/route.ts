import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { to, subject, message } = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD, 
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `<p>${message}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
