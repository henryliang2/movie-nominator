import React from 'react';
import { Button, Spinner} from '@shopify/polaris';
import MovieCard from './../MovieCard/MovieCard'
import './MovieList.css'

const MovieList = (props) => {

  return (
    <div className='movielist__container'>

      {/*  if awaiting Api Response, show spinner, else show content */}
      { props.awaitingApiResponse

        ? <div className='movielist___loading-spinner'>
            <Spinner size="large" color="teal" accessibilityLabel="Loading ..." />
          </div>

        : props.movieArray.map((movie, i) => {
          return (
            <div key={i} className='moviecard__container'>
              <MovieCard
                title={movie.Title}
                year={movie.Year}
                posterUrl={movie.Poster}
              />
              
              <div className='moviecard__overlay'>
                <p className='moviecard__movie-title'>
                  { movie.Title }<br />
                  { `(${movie.Year})` }
                </p>
                <Button
                  className='moviecard__nominate-button Polaris-Button'
                  onClick={() => {props.nominateMovie(i)}}
                  size='slim'>
                  Nominate
                </Button>
              </div>
            </div> )})
      }
    </div>
  );

}

export default MovieList;