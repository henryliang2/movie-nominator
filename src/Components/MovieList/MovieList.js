import React from 'react';
import MovieCard from './../MovieCard/MovieCard'
import './MovieList.css'

const MovieList = (props) => {

  return (
    <div className='container__moviecards'>
      {
        props.returnedMovies.map((movie, i) => {
          return (
            <div className='moviecard'>
              <MovieCard key={i}
                title={movie.Title}
                year={movie.Year}
                posterUrl={movie.Poster}
              />
            </div>
          );
        })
      }
    </div>
  );

}

export default MovieList;