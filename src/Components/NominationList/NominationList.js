import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import './NominationList.css'
import { CircleCancelMajorTwotone } from '@shopify/polaris-icons';
import { Icon, Heading, DisplayText } from '@shopify/polaris';
import { LinkedIn, GitHub, Email }  from '@material-ui/icons';


const NominationList = (props) => {

  const [movies, setMovies] = useState([]);

  // hoveredIcon state is the index of the currently hovered button
  // allowing the value to be checked by the icon's color attribute
  const [hoveredIcon, setHoveredIcon] = useState(-1);

  // true after submitting nomations
  const [nominationsSubmitted, setNominationsSubmitted] = useState(false);

  const width = window.innerWidth;
  const height= window.innerHeight;

  useEffect(() => {
    setMovies(props.nominatedMovies)
  }, [props.nominatedMovies])

  if (nominationsSubmitted === false) {

    return (
      <React.Fragment>
        <div className='nomination__header-title'>My Nominations</div>

        <div className='nomination__container'>
        
          {
            movies.map((movie, i) => {
              return <div key={i} className='nomination__moviecard'>
                  <div className='nomination__poster'>

                    {/* If no movie poster, return generic poster */}
                    { movie.Poster === 'N/A'

                      ? <div className='nomination__poster-blank'>
                          <Heading>{ movie.Title}</Heading>
                        </div>

                      : <img 
                          alt={movie.Title}
                          src={movie.Poster} 
                          width='160'
                          height='240'
                          />
                    }

                    <div className='nomination__remove-button'
                      onClick={ () => {props.removeNomination(i)} }
                      onMouseEnter={() => { setHoveredIcon(i) }}
                      onMouseLeave={() => { setHoveredIcon(-1) }}
                      >
                      <Icon source={CircleCancelMajorTwotone}
                        color={ (hoveredIcon === i) ? 'red' : 'inkLighter' } />
                    </div>
                  </div>
                  <p>{movie.Title}</p>
                  <p>({movie.Year})</p>
                </div>
            })
          }

        </div>

        { /* if there are 5 nominations, show submit button */ }
        { ( movies.length === 5 ) && 
          <div className='nomination__submit-container'>
            <div onClick={() => { setNominationsSubmitted(true) 
              }} className='nomination__submit-button' >
              Submit Nominations</div>
          </div>
        }

      </React.Fragment>
      );
    
    } else if (nominationsSubmitted === true) {

      return <React.Fragment>

          <Confetti
            width={ width - 100 }
            height={ height - 100 }
            opacity={ 0.8 }
            numberOfPieces={ 50 }
          />

          <div className='endgame__container'>

            <DisplayText 
              element='h1'
              size='extraLarge'>
                Hooray! Your nominations have been submitted.
            </DisplayText>

            <p>Thank you for checking out my project. I hope you liked it!</p>
            <p>Please check out some of my other personal projects below:</p>

            <ul>
              <li><a href='https://color-cluster.netlify.app/' 
                target='_blank' rel="noopener noreferrer">Color Cluster</a></li>
              <li><a href='http://whatpharmacistsdo.org/' 
                target='_blank' rel="noopener noreferrer">WhatPharmacistsDo</a></li>
              <li><a href='https://www.jsongfitness.com/' 
                target='_blank' rel="noopener noreferrer">JSong Fitness</a></li>
            </ul>

            <p>Below are links to my personal accounts:</p>
              <div className='endgame__buttons'>
                <a href='https://linkedin.com/in/henryliang2' 
                  target='_blank' rel="noopener noreferrer"><LinkedIn style={{ fontSize: 48 }}/></a>
                <a href='https://github.com/henryliang2' 
                  target='_blank' rel="noopener noreferrer"><GitHub style={{ fontSize: 48 }}/></a>
                <a href='mailto:henryliang@alumni.ubc.ca'><Email style={{ fontSize: 48 }}/></a>

              </div>

            <div className='nomination__submit-container'>
              <div className='nomination__submit-button'
                onClick={() => {
                  setNominationsSubmitted(false);
                }} 
                >
                ← Back to your Nominees
              </div>
              <div className='nomination__submit-button'
                onClick={() => {
                  props.setNominatedMovies([]);
                  setNominationsSubmitted(false);
                }} 
                >
                ← Start Over
              </div>
            </div>
          </div>
        </React.Fragment>
    }
}

export default NominationList