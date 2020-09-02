import React from 'react';
import { Button } from '@shopify/polaris';
import MovieCard from './../MovieCard/MovieCard'
import './MovieList.css'

const MovieList = (props) => {

  return (
    <div className='moviecard__container'>
      {
        props.movieArray.map((movie, i) => {
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
                <Button
                  className='moviecard__nominate-button Polaris-Button'
                  onClick={() => {props.nominateMovie(i)}}
                  size='large'>
                  Nominate
                </Button>
              </div>
            </div> )})
      }
    </div>
  );

}

export default MovieList;