import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { id,name, email, petName, medicineName, dueDate,type } = await req.json();
    // const body = await req.json();

    console.log(`id : ${id}\n name : ${name}\n email : ${email}\n petName : ${petName}\n medicineName : ${medicineName}\n type : ${type}\n`)

    if (!name || !email || !petName || !medicineName || !dueDate || !id ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if(type === "INJECTION"){
      const res = await prisma.medicineRecord.update({
        where : {
          id : id
        },
        data : {
          reminder : new Date()
        }
      })
    }

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const formattedDate = new Date(dueDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 15px; background: #f9f9f9;">
        <h2 style="color: #2c3e50;">Hello ${name},</h2>
        <p>This is a friendly reminder from <strong>Karni Medical</strong> 💊</p>

        <p>Your pet <strong style="color:#27ae60;">${petName}</strong> 
        is scheduled for the next dose of <strong style="color:#2980b9;">${medicineName}</strong>.</p>

        <p><strong>Due Date:</strong> ${formattedDate}</p>

        <p style="margin-top:15px;">
          Please make sure to give the medicine on time to ensure 
          <strong>${petName}</strong> stays happy and healthy 🐾.
        </p>

        <p style="margin-top:20px;">Stay well,<br/>💙 The Karni Medical Team</p>
      </div>
    `;

    
    await transporter.sendMail({
      from: `"Karni Medical" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `⏰ Reminder: ${petName}'s medicine dose (${medicineName}) is due soon!`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: "Reminder sent successfully" });
  } catch (err: any) {
    console.error("SendReminder error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
