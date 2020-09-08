import React from 'react';
import { Button, Spinner } from '@shopify/polaris';
import MovieCard from './../MovieCard/MovieCard'
import './MovieList.css'

const MovieList = (props) => {

  const movieYearAndTitle = props.nominatedMovies.map((movie, i) => {
    return `${movie.Year}-${movie.Title}`
  })

  // smaller font size for title if title is very large
  const movieTitleArray = props.movieArray.map((movie, i) => {
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
                  classNames={'moviecard__image'}
                  id={`returned-image-${props.index}`}
                  title={ movie.Title }
                  year={ movie.Year }
                  posterUrl={ movie.Poster }
                  index={ i }
                />
                
                <div className='moviecard__overlay'>
                  <p className={movieTitleArray[i]}>
                    { movie.Title }<br />
                    { `(${movie.Year})` }
                  </p>

                  {/* display nominate button only if not already nominated */}
                  { movieYearAndTitle.includes(`${movie.Year}-${movie.Title}`)

                    ? <p className='moviecard__nominate-unable'>Already Nominated!</p>

                    : <Button primary
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