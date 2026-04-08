import { getMovie } from '@/utils/tmdb';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

// TRÈS IMPORTANT : Bien mettre "export default async function"
export default async function MoviePage({ params }) {
  // On attend que les paramètres de l'URL soient prêts (Next.js 15+)
  const resolvedParams = await params; 
  const id = resolvedParams.id;
  
  // On récupère les infos du film
  const movie = await getMovie(id);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <Link href="/" className="inline-block mb-8 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition font-bold">
        ← Retour à l'accueil
      </Link>
      
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        {/* Affiche du film */}
        <div className="w-full md:w-1/3">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="rounded-2xl border border-gray-700 shadow-2xl w-full"
          />
        </div>
        
        {/* Détails du film */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-black mb-4">{movie.title}</h1>
          
          <div className="mb-8">
            <FavoriteButton movie={movie} />
          </div>

          <div className="flex items-center gap-4 mb-6 text-xl">
            <span className="text-yellow-400 font-bold">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300">{movie.release_date?.split('-')[0]}</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 text-red-500 italic">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-8">
            {movie.overview || "Aucun résumé disponible pour ce film."}
          </p>
          
          <div className="bg-gray-800 p-6 rounded-xl grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-500 uppercase font-bold mb-1 tracking-widest">Durée</p>
              <p className="text-white text-base">{movie.runtime} minutes</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase font-bold mb-1 tracking-widest">Genres</p>
              <p className="text-white text-base">{movie.genres?.map(g => g.name).join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
