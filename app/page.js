import { getTrendingMovies } from '@/utils/tmdb';
import SearchBar from '@/components/SearchBar';
import FavoriteButton from '@/components/FavoriteButton';
import Link from 'next/link';

export default async function Home() {
  const movies = await getTrendingMovies();

  return (
    <main className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen text-white relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 p-6 md:p-12">
        {/* En-tête */}
        <header className="max-w-7xl mx-auto mb-16">
          <div className="flex justify-between items-start mb-10">
            <div className="flex-1">
              <h1 className="relative mb-3">
                {/* Effet de lueur derrière */}
                <span className="absolute inset-0 text-red-500 blur-3xl opacity-50 animate-pulse font-black tracking-tighter">
                  JASCINE
                </span>
                {/* Texte principal avec effet néon */}
                <span className="relative text-6xl md:text-8xl font-black tracking-tighter">
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    JAS
                  </span>
                  <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                    CINE
                  </span>
                </span>
                {/* Effet de contour brillant */}
                <span className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-2xl rounded-lg animate-pulse"></span>
              </h1>
              <p className="text-gray-400 text-lg font-mono tracking-widest uppercase">
                <span className="text-red-500">&gt;</span> Découvrez les films du moment<span className="animate-pulse">_</span>
              </p>
            </div>
            <Link
              href="/favorites"
              className="group px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full hover:bg-red-600 hover:border-red-600 transition-all duration-300 flex items-center gap-2 shrink-0"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="font-medium hidden md:inline">Mes Favoris</span>
            </Link>
          </div>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </header>

        {/* Grille de films */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image du film */}
              <Link href={`/movie/${movie.id}`} className="block relative overflow-hidden">
                <div className="aspect-[2/3] relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Badge de note */}
                  {movie.vote_average && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold border border-gray-600/50 flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Informations du film */}
              <div className="p-4 bg-gradient-to-t from-gray-900/90 to-gray-800/50">
                <Link href={`/movie/${movie.id}`}>
                  <h2 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2 min-h-[2.5rem]">
                    {movie.title}
                  </h2>
                </Link>
                
                {movie.release_date && (
                  <p className="text-xs text-gray-400 mb-3">📅 {movie.release_date.split('-')[0]}</p>
                )}

                {/* Bouton favori */}
                <FavoriteButton movie={movie} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
