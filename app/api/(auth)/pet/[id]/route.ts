import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

function extractIdFromReq(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1];
}

export async function GET(req: Request) {
  try {
    const id = extractIdFromReq(req);

    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return new Response(
        JSON.stringify({ message: "Pet not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "pet given",
        pet,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("GET pets [id] error:", err);

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
    const id = extractIdFromReq(req);

    const petSchema = z.object({
      userId: z.string().optional(),
      name: z.string().optional(),
      species: z.string().optional(),
      breed: z.string().optional(),
      gender: z.string().optional(),
      dob: z.coerce.date().optional(),
    });

    const body = await req.json();
    const parsed = petSchema.safeParse(body);

    if (!parsed.success) {
      console.error("invalid data given :");

      return new Response(
        JSON.stringify({
          message: "invalid data given",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const dataToUpdate = parsed.data;

    if (Object.keys(dataToUpdate).length === 0) {
      return new Response(
        JSON.stringify({
          message: "No valid fields provided for update",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const update = await prisma.pet.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });

    return new Response(
      JSON.stringify({
        message: "pet updated",
        update,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("update pets [id] error:", err);

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
