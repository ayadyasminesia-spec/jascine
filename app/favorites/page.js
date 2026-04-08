"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFavorites(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = async (movieId) => {
    setDeleting(movieId);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: movieId }),
      });

      if (res.ok) {
        setFavorites(favorites.filter((movie) => movie.movieId !== movieId));
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 text-xl font-light tracking-wider">Chargement de tes favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 p-8 md:p-12">
        {/* En-tête */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-gray-800/50">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent tracking-tight mb-2">
                MES FAVORIS
              </h1>
              <p className="text-gray-400 text-lg">
                {favorites.length} film{favorites.length > 1 ? 's' : ''} dans ta collection ✨
              </p>
            </div>
            <Link
              href="/"
              className="group px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full hover:bg-red-600 hover:border-red-600 transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Retour à l'accueil</span>
            </Link>
          </div>
        </div>

        {/* État vide */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center animate-fadeIn">
            <div className="relative mb-8">
              <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>🎬</div>
              <div className="absolute -inset-4 bg-red-500/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
            <h2 className="text-4xl font-bold text-gray-200 mb-4">Ta liste est vide</h2>
            <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed">
              Tu n'as pas encore ajouté de films à tes coups de cœur. C'est le moment d'explorer !
            </p>
            <Link
              href="/"
              className="group relative px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full font-bold text-lg text-white shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10">➕ Ajouter des films</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        ) : (
          /* Grille de favoris */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {favorites.map((movie, index) => (
              <div
                key={movie.id}
                className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image du film */}
                <Link href={`/movie/${movie.movieId}`} className="block relative overflow-hidden">
                  <div className="aspect-[2/3] relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Badge de note */}
                    {movie.releaseDate && (
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold border border-gray-600/50">
                        📅 {movie.releaseDate.split('-')[0]}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Informations du film */}
                <div className="p-4 bg-gradient-to-t from-gray-900/90 to-gray-800/50">
                  <Link href={`/movie/${movie.movieId}`}>
                    <h2 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2 min-h-[2.5rem]">
                      {movie.title}
                    </h2>
                  </Link>

                  {/* Bouton supprimer */}
                  <button
                    onClick={() => removeFavorite(movie.movieId)}
                    disabled={deleting === movie.movieId}
                    className="w-full mt-2 px-4 py-2.5 bg-gray-700/50 hover:bg-red-600 disabled:bg-gray-700/30 backdrop-blur-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium group/btn"
                    title="Supprimer de la liste"
                  >
                    {deleting === movie.movieId ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Suppression...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 transition-transform group-hover/btn:rotate-12"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                        <span>Retirer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
