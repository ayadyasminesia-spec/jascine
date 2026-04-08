import { searchMovies } from '@/utils/tmdb';
import Link from 'next/link';

export default async function SearchPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  const movies = query ? await searchMovies(query) : [];

  return (
    <main className="bg-gray-900 min-h-screen text-white p-6 md:p-12">
      <Link href="/" className="inline-block mb-8 text-red-600 hover:underline">
        ← Retour à l'accueil
      </Link>

      <h1 className="text-4xl font-bold mb-8">
        Résultats pour « {query} »
      </h1>

      {movies.length === 0 ? (
        <p className="text-gray-400 text-lg">Aucun film trouvé.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {movies.map((movie) => (
            movie.poster_path && (
              <Link href={`/movie/${movie.id}`} key={movie.id}>
                <div className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:ring-4 hover:ring-red-600 transition-all cursor-pointer">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto object-cover group-hover:opacity-50 transition-opacity"
                  />
                  <div className="p-4">
                    <h2 className="font-bold truncate text-sm">{movie.title}</h2>
                    <p className="text-xs text-gray-500 mt-1">{movie.release_date?.split('-')[0]}</p>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      )}
    </main>
  );
}
