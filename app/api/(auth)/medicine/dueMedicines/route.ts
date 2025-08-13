import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(req : Request){
  try{
    const { searchParams } = new URL(req.url);
    let ReqDays = Number(searchParams.get("days")) || 0;


    const today = new Date();

    const daysLater = (days : number) => {
      const date = new Date();

      date.setDate(date.getDate() + days);
      return date;
    }

    const res = await prisma.medicineRecord.findMany({
      where : {
        OR : [
          { nextDoseDue : { lte : today } },
          { nextDoseDue : { gte : today , lte : daysLater(ReqDays) } }
        ],
      },
      include : {
        pet : {
          include : {
            user : true,
          },
        },
      },
      orderBy: {
        nextDoseDue: "asc", 
      }
    })

    const medicines = res.map(m => ({
      id: m.id,
      medicineName: m.medicineName,
      dateGiven: m.dateGiven,
      dueDate: m.nextDoseDue,
      pet_id: m.pet?.id,
      petName: m.pet?.name,
      user_id: m.pet?.user?.id,
      userName: m.pet?.user?.name
    }));



    return new Response(JSON.stringify({
      message: "all due dates",
      medicines 
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