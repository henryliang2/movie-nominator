import React, { useEffect, useState } from 'react';
import './NominationList.css'
import { CircleCancelMajorTwotone } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

const NominationList = (props) => {

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(props.nominatedMovies)
    console.log('useeffect firing', movies)
  }, [props.nominatedMovies, movies])

  return (
    <React.Fragment>
      <div>My Nominations</div>

      <div className='nomination__container'>
      
        {
          movies.map((movie, i) => {
            return <div key={i} className='nomination__moviecard'>
                <div className='nomination__poster'>
                  <img 
                    alt={movie.Title}
                    src={movie.Poster} 
                    width='100'
                    height='150'
                    />
                  <div 
                    className='nomination__remove-button'
                    onClick={ () => {props.removeNomination(i)} }
                    >
                    <Icon source={CircleCancelMajorTwotone} 
                      color='indigoDark' />
                  </div>
                </div>
                <p>{movie.Title}</p>
                <p>({movie.Year})</p>
              </div>
              
          })
        }
      </div>

    </React.Fragment>
    );
}

export default NominationList