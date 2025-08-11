import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function extractIdFromReq(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  return segments[segments.length - 1];
}

export async function GET(req: Request) {
  try {
    const id = extractIdFromReq(req);

    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        phoneNo: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: "user found",
        user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("get user data error:", err);

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

    const data = await req.json();

    const dataSchema = z.object({
      name: z.string().min(1).optional(),
      phoneNo: z.string().regex(/^\d{10}$/).optional(),
    });

    const parsed = dataSchema.safeParse(data);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: parsed.error,
        }),
        {
          status: 400,
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

    if (dataToUpdate.phoneNo) {
      const isThereUser = await prisma.user.findFirst({
        where: {
          phoneNo: dataToUpdate.phoneNo,
          NOT: { id },
        },
      });

      if (isThereUser) {
        return new Response(
          JSON.stringify({
            message: "Phone number already in use by another user",
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    const userUpdated = await prisma.user.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });

    return new Response(
      JSON.stringify({
        message: "user updated",
        userUpdated,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Update user error:", err);

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

export async function DELETE(req: Request) {
  try {
    const id = extractIdFromReq(req);

    const userDeleted = await prisma.user.delete({
      where: {
        id,
      },
    });

    return new Response(
      JSON.stringify({
        message: "user deleted",
        userDeleted,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("delete user error:", err);

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
