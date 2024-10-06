/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Loader from "../Loader";
import StarRating from "../StarRating";
import { useKey } from "../../hooks/useKey";

const KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MovieDetails({
  selectedId,
  onCloseDetails,
  onAddWatched,
  watched,
}) {
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(watchedUserRating ?? 0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    imdbRating,
    Runtime: runtime,
    Released: released,
    Actors: actors,
    Director: director,
    Plot: plot,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseDetails();
  }

  function handleUserRating(rating) {
    setUserRating(rating);
  }

  useKey("Escape", onCloseDetails);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const response = await fetch(
          `${BASE_URL}?apikey=${KEY}&i=${selectedId}`
        );
        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;

      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn🍿";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseDetails}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating size={24} onSetRating={handleUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You already rated it with {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
