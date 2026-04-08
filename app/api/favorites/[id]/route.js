import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

async function getUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get("userId")?.value;
  if (!userId) userId = crypto.randomUUID();
  return userId;
}

export async function DELETE(request, { params }) {
  try {
    const userId = await getUserId();
    const { id } = await params;

    await prisma.favorite.delete({
      where: {
        id,
        userId,
      },
    });

    return NextResponse.json({ message: "Favori supprimé" });
  } catch (error) {
    console.error("❌ DELETE favorite:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
