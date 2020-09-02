import React from 'react';
import MovieCard from './../MovieCard/MovieCard'
import { Card } from '@shopify/polaris';
import './MovieList.css'

const MovieList = (props) => {

  return (
    <div className='moviecard__container'>
      {
        props.movies.map((movie, i) => {
          return (
            <div className='moviecard'>
              <MovieCard key={i}
                title={movie.Title}
                year={movie.Year}
                posterUrl={movie.Poster}
              />
              
              <div 
                className='moviecard__overlay'>
                <p className='moviecard__movie-title'>
                  { movie.Title }<br />
                  { `(${movie.Year})` }
                </p>
                <button 
                  className='moviecard__nominate-button Polaris-Button'
                  onClick={() => {props.nominateMovie(i)}}>
                  Nominate
                </button>
              </div>
            </div> )})
      }
    </div>
  );

}

export default MovieList;