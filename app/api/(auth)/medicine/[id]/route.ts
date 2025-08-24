import { prisma } from "@/lib/prisma";


function extractIdFromReq(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1];
}

export async function GET(req : Request){
  try{

    const id = extractIdFromReq(req)

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
        medicines : {
          include : {
            Medicine : true
          }
        }
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




