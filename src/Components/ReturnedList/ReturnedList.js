import React, { useEffect, useState } from 'react';
import { Button, Spinner } from '@shopify/polaris';
import MovieCard from '../MovieCard/MovieCard'
import '../MovieCard/MovieCard.css'
import './ReturnedList.css'

const ReturnedList = (props) => {

  const [movieIdArray, setMovieIdArray] = useState([])

  // an array of the  Movie IMDB ids of nominated movies
  useEffect(() => {
    const array = props.nominatedMovies.map(movie => { return movie.imdbID })
    setMovieIdArray(array);
  }, [props.nominatedMovies])
  
  return (
    <div className='returnlist__container'>

      { //  if awaiting Api Response, show spinner
        props.awaitingApiResponse

        ? <div className='returnlist__loading-spinner'>
            <Spinner size="large" color="teal" accessibilityLabel="Loading ..." />
          </div>
      
        // if API response received, show content
        : <React.Fragment>
          { props.returnedMovies.map((movie, i) => {
            return (
              <div key={i} className='returned'>
                <MovieCard
                  classNames={'card__image'}
                  id={`returned-image-${props.index}`}
                  title={ movie.Title }
                  year={ movie.Year }
                  posterUrl={ movie.Poster }
                  index={ i }
                />
                
                { // Overlay that darkens and displays title + year onMouseOver    
                }
                <div className='returned__overlay'>
                  <p className={ movie.Title.length < 40 
                    ? 'returned__title' 
                    : 'returned__title returned__title--small'
                  }>
                    { movie.Title }<br />
                    { `(${movie.Year})` }
                  </p>

                  { // display nominate button only if not already nominated 
                    movieIdArray.includes(movie.imdbID)

                    ? <p className='returned__nominate-unable'>Already Nominated!</p>

                    : <Button primary
                        className='Polaris-Button'
                        onClick={() => {props.nominateMovie(i)}}
                        size='slim'>
                        Nominate
                      </Button> 
                  }
                </div>
              </div> )})}
          </React.Fragment>
      }
    </div>
  );

}

export default ReturnedList;