import { collection, query, where, getDocs, doc, setDoc, updateDoc, limit, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Updates search count for a movie in Firebase.
 * @param {string} queryString - The search term.
 * @param {Object} movie - The movie object containing id, title, and poster details.
 */
export const updateSearchCount = async (queryString: string, movie: Movie) => {
    if (!queryString || !movie || !movie.id) return;

    const moviesRef = collection(db, "metrics");

    try {
        // Query for existing movie by search term
        const q = query(moviesRef, where("searchTerm", "==", queryString));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // If movie exists, update count
            const existingMovieDoc = querySnapshot.docs[0];
            const existingMovieData = existingMovieDoc.data();

            await updateDoc(doc(db, "metrics", existingMovieDoc.id), {
                count: existingMovieData.count + 1,
            });
            console.log(`Updated search count for ${movie.title}`);
        } else {
            // If new, create document
            await setDoc(doc(moviesRef), {
                searchTerm: queryString,
                count: 1,
                movie_id: movie.id,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
            console.log(`Added new movie: ${movie.title}`);
        }
    } catch (error) {
        console.error("Error updating search count:", error);
    }
};


export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    const moviesRef = collection(db, "metrics");
    const q = query(moviesRef, orderBy("count", "desc"), limit(5));
    try {
        const querySnapshot = await getDocs(q);
        const trendingMovies = querySnapshot.docs.map(doc => doc.data())
        return trendingMovies as unknown as TrendingMovie[];

    } catch (error) {
        console.log(error)
        return undefined
    }
}
