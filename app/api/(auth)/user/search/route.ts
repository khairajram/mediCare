import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try{
    const { searchParams } = new URL(req.url);
    const phoneNo = searchParams.get("phone");

    if (!phoneNo) {
      return new Response(JSON.stringify({ message: "Phone number is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await prisma.user.findMany({
      where: { phoneNo : {
        contains: phoneNo,
      } },
      take : 5,
      select : {
        id : true,
        name : true,
        phoneNo : true
      },
    });

    if (user.length === 0) {
      return new Response(JSON.stringify({ message: "No user found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "user found", user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }catch(err : any){
    console.error("search user error:", err);

    return new Response(JSON.stringify({
        message: "Internal Server Error",
        error: err.message,
      }),{
        status : 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
  
}
