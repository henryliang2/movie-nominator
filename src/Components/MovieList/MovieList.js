import React from 'react';
import { Button, Spinner } from '@shopify/polaris';
import MovieCard from './../MovieCard/MovieCard'
import './MovieList.css'

const MovieList = (props) => {

  const nominatedMovieTitles = props.nominatedMovies.map((movie, i) => {
    return movie.Title;
  })

  const titleClassNameArray = props.movieArray.map((movie, i) => {
    if (movie.Title.length > 40) { 
      return 'moviecard__movie-title-small' 
    } else { 
      return 'moviecard__movie-title' 
    }
  });

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
                  <p className={titleClassNameArray[i]}>
                    { movie.Title }<br />
                    { `(${movie.Year})` }
                  </p>

                  {/* display nominate button only if not already nominated */}
                  { nominatedMovieTitles.includes(movie.Title)

                    ? <p className='moviecard__nominate-unable'>Already Nominated!</p>

                    : <Button
                        className='moviecard__nominate-button Polaris-Button'
                        onClick={() => {props.nominateMovie(i)}}
                        size='slim'>
                        Nominate
                      </Button> 
                  }
                </div>
              </div> 
            )}
          )
      }
    </div>
  );

}

export default MovieList;