import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Schéma pour AJOUTER un favori (champs obligatoires)
const addFavoriteSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(200),
  poster_path: z.string().optional(),
  release_date: z.string().optional(),
  overview: z.string().optional(),
});

// Schéma pour SUPPRIMER un favori (juste l'id suffit)
const removeFavoriteSchema = z.object({
  id: z.number().int().positive(),
});

// Génère un userId compatible MongoDB (24 caractères hex) ou le récupère du cookie
async function getUserId() {
  const cookieStore = await cookies();
  let userId = cookieStore.get("userId")?.value;

  if (!userId) {
    userId = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
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

    // On valide juste l'id pour vérifier si le favori existe
    const { id: movieId } = removeFavoriteSchema.parse(body);

    const existing = await prisma.favorite.findUnique({
      where: {
        movieId_userId: { movieId, userId },
      },
    });

    // Si le film existe déjà, on le supprime (toggle)
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ message: "Favori supprimé", action: "removed" });
    }

    // Sinon on a besoin des infos complètes pour l'ajouter
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
