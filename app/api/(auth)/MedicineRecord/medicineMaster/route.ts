import { PrismaClient } from "@prisma/client";
import { z } from "zod"

const prisma = new PrismaClient();


export async function POST(req : Request){

  try{
    const body = await req.json();

    const reqSchema = z.object({
      name : z.string(),
      dose : z.string().optional(),
      type : z.enum(["TABLET","SYRUP","INJECTION","TOPICAL","POWDER","LIQUID"])
    });

    const parsed = reqSchema.safeParse(body);

    if(!parsed.success){
        console.error("invalid input data");
        
        return new Response(JSON.stringify({
          message: " invalid input data",
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

    const data = parsed.data;

    const res = await prisma.medicine.create({
        data : {
          name : data.name,
          dose : data.dose,
          type : data.type
        }
      })



      return new Response(JSON.stringify({
        message: "medicine created",
        res
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


export async function GET() {
  try {
    const medicines = await prisma.medicine.findMany({
      orderBy: { name: "asc" },
    });

    return new Response(
      JSON.stringify({
        message: "All medicines fetched successfully",
        medicines,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Fetch medicines error:", err);

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


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const updated = await prisma.medicine.update({
      where: { id },
      data: body,
    });

    return new Response(JSON.stringify({ message: "Updated", updated }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
