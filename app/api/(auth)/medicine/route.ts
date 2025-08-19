import { PrismaClient } from "@prisma/client";
import { date, z } from "zod"

const prisma = new PrismaClient();


export async function POST(req : Request){
  try{

    const petSchema = z.object({
      petId: z.string(),
      medicineId: z.string(),
      dosage: z.string(),
      dateGiven: z.coerce.date(),
      nextDoseDue: z.coerce.date().optional(),
      notes: z.string().optional()
    });

    const body = await req.json();
    const parsed = petSchema.safeParse(body);

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

    const res = await prisma.medicineRecord.create({
      data : {
        petId :        data.petId,
        medicineId : data.medicineId,
        dosage :      data.dosage,
        dateGiven :   data.dateGiven,
        nextDoseDue : data.nextDoseDue,
        notes    :    data.notes,
      }
    })



    return new Response(JSON.stringify({
      message: "pets created",
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





export async function GET(req : Request){
  try{

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ message: "ID query param is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    
    const pet = await prisma.pet.findUnique({
      where : {
        id : id
      },
      include : {
        medicines : true
      }
    })

    if (pet?.medicines.length === 0) {
      console.log("No medicines found");
      
      return new Response(JSON.stringify({
        message: "No medicines found",
        pet
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }


    return new Response(JSON.stringify({
      message: "medicines given",
      pet
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });


  }catch(err : any){
    console.error("GET pets error:", err);

    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: err.message,
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

