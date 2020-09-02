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
              
              <div 
                className='moviecard__overlay'
                onMouseOver={(e) => {console.log(e)}}>
                <p className='moviecard__movie-title'>
                  { movie.Title }<br />
                  { `(${movie.Year})` }
                </p>
                <button className='moviecard__nominate-button Polaris-Button'>
                  Nominate
                </button>
              </div>
            </div> )})
      }
    </div>
  );

}

export default MovieList;