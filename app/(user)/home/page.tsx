import { prisma } from "@/lib/prisma";
import  jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CustomerProfile, Pet, User } from "./customerProfile";

export default async function HomePage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/");  
  }

  let decoded : any;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET!);
    if(decoded.role !== "user"){
      redirect("/")
    }
  }catch(err){
    return <div><a href="/">logIn</a></div>
  }

  const userId = decoded.id;

  const res = await prisma.user.findUnique({
    where : {
      id : userId
    },
    include : {
      pets : true
    }
  })

  if(!res){
    redirect("/")
  }

  const user : User = {
    id : res?.id,
    name : res?.name,
    phoneNo : res?.phoneNo,
    email : res?.email ?? "",
    address : res?.address ?? ""
  }

  const pets  = res?.pets

  return (
    <CustomerProfile user={user} pets={pets}></CustomerProfile>
  );
}

