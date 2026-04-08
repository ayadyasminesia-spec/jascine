// utils/tmdb.js

const API_KEY = process.env.TMDB_API_KEY; // On récupère ta clé cachée
const BASE_URL = 'https://api.themoviedb.org/3'; // L'adresse de TMDB

// Cette fonction est "async" (asynchrone) car elle doit attendre une réponse d'internet
export async function getTrendingMovies() {
  // On envoie la demande
  const response = await fetch(
    `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=fr-FR`
  );

  // On transforme la réponse en format "JSON" (un format que JavaScript comprend bien)
  const data = await response.json();
  
  // On renvoie juste la liste des films (qui est dans "results")
  return data.results;
}

export async function getMovie(id) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`
  );
  if (!response.ok) throw new Error('Film introuvable');
  return await response.json();
}

export async function searchMovies(query) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.results;
}
