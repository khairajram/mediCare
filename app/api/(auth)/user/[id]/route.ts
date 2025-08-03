import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req : Request, { params } : { params : { id : string }}){
  try{
    const idQuery = params.id;

    const user = await prisma.user.findFirst({
      where : {
        id : idQuery
      },
      select : {
        id : true,
        name : true,
        phoneNo : true
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ 
      message: "user found",
      user
     }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

  }catch(err : any){
    console.error("get user data error:", err);

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


export async function PUT(req : Request , { params } : { params : { id : string }}){
  try{
      const data = await req.json();

      const dataSchema = z.object({
        name : z.string().min(1).optional(),
        phoneNo : z.string().regex(/^\d{10}$/).optional()
      });

      const parsed = dataSchema.safeParse(data);

      if(!parsed.success){
        return new Response(JSON.stringify({
          message: "Validation error",
          errors: parsed.error,
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const dataToUpdate = parsed.data;

      if (Object.keys(dataToUpdate).length === 0) {
      return new Response(JSON.stringify({
        message: "No valid fields provided for update",
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if(dataToUpdate.phoneNo){
      const isThereUser = await prisma.user.findFirst({
        where : {
          phoneNo : dataToUpdate.phoneNo,
          NOT : { id : params.id}
        }
      })

      if(isThereUser){
        return new Response(JSON.stringify({
          message: "Phone number already in use by another user",
        }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

      const userUpdated = await prisma.user.update({
        where : {
          id : params.id
        },
        data : dataToUpdate
      })

      return new Response(JSON.stringify({
        message: "user updated",
        userUpdated
      }),{
        status : 200,
        headers: { "Content-Type": "application/json" }
      }
    )

  }catch(err : any){
    console.error("Update user error:", err);

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


export async function DELETE(req : Request , { params } : { params : { id : string }}){
  try{
      const userDeleted = await prisma.user.delete({
        where : {
          id : params.id
        }
      })

      return new Response(JSON.stringify({
        message: "user deleted",
        userDeleted
      }),{
        status : 200,
        headers: { "Content-Type": "application/json" }
      }
    )

  }catch(err : any){
    console.error("delete user error:", err);

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