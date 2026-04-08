import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

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

// Génère ou récupère le userId (et set le cookie si nouveau)
async function getUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get("userId")?.value;

  if (!userId) {
    userId = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    cookieStore.set("userId", userId, COOKIE_OPTS);
  }
  return userId;
}

export async function GET() {
  try {
    const userId = await getUserId();
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
