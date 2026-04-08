import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addFavoriteSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  poster_path: z.string().optional(),
  release_date: z.string().optional(),
  overview: z.string().optional(),
});

const removeFavoriteSchema = z.object({
  id: z.number().int().positive(),
});

// Récupère le userId du cookie (déjà créé côté client)
async function getUserId() {
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value || "";
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json([]);
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(favorites || []);
  } catch (error) {
    console.error("Erreur GET API :", error);
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const { id: movieId } = removeFavoriteSchema.parse(body);

    const existing = await prisma.favorite.findUnique({
      where: {
        movieId_userId: { movieId, userId },
      },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: "Favori supprimé", action: "removed" });
    }

    const data = addFavoriteSchema.parse(body);

    const favorite = await prisma.favorite.create({
      data: {
        movieId: data.id,
        title: data.title,
        posterPath: data.poster_path || "",
        releaseDate: data.release_date || "",
        overview: body.overview || "",
        userId,
      },
    });

    return NextResponse.json({ message: "Favori ajouté", action: "added", favorite });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 });
    }
    console.error("❌ POST favorite:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
