import React, { useEffect, useState } from 'react';
import './NominationList.css'
import { CircleCancelMajorTwotone } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

const NominationList = (props) => {

  const [movies, setMovies] = useState([]);

  // hoveredIcon state is the index of the currently hovered button
  // allowing the value to be checked by the icon's color attribute
  const [hoveredIcon, setHoveredIcon] = useState(-1);

  useEffect(() => {
    setMovies(props.nominatedMovies)
  }, [props.nominatedMovies])

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
                    width='160'
                    height='240'
                    />
                  <div className='nomination__remove-button'
                    onClick={ () => {props.removeNomination(i)} }
                    onMouseEnter={() => { setHoveredIcon(i) }}
                    onMouseLeave={() => { setHoveredIcon(-1) }}
                    >
                    <Icon source={CircleCancelMajorTwotone}
                      color={ (hoveredIcon === i) ? 'red' : 'indigoDark' } />
                  </div>
                </div>
                <p>{movie.Title}</p>
                <p>({movie.Year})</p>
              </div>
              
          })
        }

        { /* if there are 5 nominations, show submit button */ }
        { ( movies.length === 5 ) && 
          <div className='nomination__submit-container'>
            <div className='nomination__submit-button'>Submit Nominations</div>
          </div>
        }

      </div>

    </React.Fragment>
    );
}

export default NominationList