import React, { useEffect, useState } from 'react';
import { Button, Spinner } from '@shopify/polaris';
import MovieCard from '../MovieCard/MovieCard'
import './ReturnedList.css'

const ReturnedList = (props) => {

  const [movieId, setMovieId] = useState([])

  const [titleArray, setTitleArray] = useState([])

  useEffect(() => {
    const array = props.nominatedMovies.map((movie, i) => {
      return `${movie.Year}${movie.Title}`
    })
    setMovieId(array);
  }, [props.nominatedMovies])

  // smaller font size for title if title is very large
  useEffect(() => {
    const array = props.returnedMovies.map((movie, i) => {
        return ( movie.Title.length > 40
        ? 'moviecard__movie-title-small' 
        : 'moviecard__movie-title'
      )
    });
    setTitleArray(array)
  }, [props.returnedMovies])
  
  return (
    <div className='returnedlist__container'>

      {/*  if awaiting Api Response, show spinner, else show content */}
      { props.awaitingApiResponse

        ? <div className='returnedlist___loading-spinner'>
            <Spinner size="large" color="teal" accessibilityLabel="Loading ..." />
          </div>

        : props.returnedMovies.map((movie, i) => {
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
                  <p className={titleArray[i]}>
                    { movie.Title }<br />
                    { `(${movie.Year})` }
                  </p>

                  {/* display nominate button only if not already nominated */}
                  { movieId.includes(`${movie.Year}${movie.Title}`)

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

export default ReturnedList;