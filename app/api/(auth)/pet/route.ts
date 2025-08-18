import { PrismaClient } from "@prisma/client";
import { useId } from "react";
import { date, z } from "zod"

const prisma = new PrismaClient();

export async function POST(req : Request){
  try{

    const petSchema = z.object({
      userId: z.string(),
      name: z.string(),
      species: z.string(),
      breed: z.string().optional(),
      gender: z.string(),
      dob: z.coerce.date().optional() 
    });

    const body = await req.json();
    const parsed = petSchema.safeParse(body);

    if(!parsed.success){
      console.error("req body str. is invalid...");
      
      return new Response(JSON.stringify({
        message: "req body str. is invalid",
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = parsed.data;

    const users = await prisma.user.findFirst({
      where : {
        id : data.userId
      }
    })

    if (!users) {
      console.error("No users found. Please create users first.");
      
      return new Response(JSON.stringify({
        message: "No users found. Please create users first",
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    const created = await prisma.pet.createMany({
      data: data,
      skipDuplicates: true,
    });


    return new Response(JSON.stringify({
      message: "pets created",
      created
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });


  }catch(err : any){
    console.error("Create pets error:", err);

    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: err.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const petSchema = z.object({
      userId: z.string(),
    });

    const parsed = petSchema.safeParse({ userId });

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ message: "Invalid userId" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = parsed.data;

    const userWithPets = await prisma.user.findFirst({
      where: { id: data.userId },
      include: { pets: true }
    });

    if (!userWithPets) {
      return new Response(
        JSON.stringify({ message: "No users found. Please create users first" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "User and pets retrieved",
        user: {
          id: userWithPets.id,
          name: userWithPets.name,
          phoneNo: userWithPets.phoneNo,
          address: userWithPets.address,
        },
        pets: userWithPets.pets,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("GET pets error:", err);

    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


