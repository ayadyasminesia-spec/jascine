"use client";
import { useState, useEffect } from "react";
import { getUserId } from "@/lib/userId";

export default function FavoriteButton({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Garantit que le cookie existe avant tout fetch
  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.some((fav) => fav.movieId === movie.id));
        }
      } catch (err) {
        console.error("Erreur check favoris:", err);
      }
    };
    if (movie?.id) {
      checkFavorite();
    }
  }, [movie.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          overview: movie.overview,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Erreur API:", data.error);
        alert(data.error || "Erreur lors de l'ajout aux favoris");
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
      alert("Erreur de connexion à la base de données");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`mt-2 p-2 rounded-lg text-sm transition-all ${
        isFavorite ? "bg-red-600 text-white" : "bg-gray-700 text-gray-200"
      } ${loading ? "opacity-50" : "hover:scale-105"}`}
    >
      {loading ? "..." : isFavorite ? "❤️ Favori" : "🤍 Ajouter"}
    </button>
  );
}
