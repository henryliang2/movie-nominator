import React, { useRef, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import MovieCard from './../MovieCard/MovieCard';
import '../MovieCard/MovieCard.css';
import './NominationList.css';
import { CircleCancelMajorTwotone } from '@shopify/polaris-icons';
import { Icon, DisplayText } from '@shopify/polaris';
import { LinkedIn, GitHub, Email }  from '@material-ui/icons';


const NominationList = (props) => {

  // hoveredIcon state is the index of the currently hovered button
  // allowing the value to be checked by the icon's color attribute
  const [hoveredIcon, setHoveredIcon] = useState(-1);

  // true after submitting nomations
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    isSubmitted
    ? <DisplayPortfolio 
        setIsSubmitted = { setIsSubmitted }
        setNominatedMovies = {  props.setNominatedMovies }
      />

    : <DisplayNominations 
        nominatedMovies = { props.nominatedMovies }
        removeNomination = { props.removeNomination }
        hoveredIcon = { hoveredIcon }
        setHoveredIcon = { setHoveredIcon }
        setIsSubmitted = { setIsSubmitted }
        isSignedIn = { props.isSignedIn }
      />
  );
  
}

// this route houses all of the nominations and is the default route
const DisplayNominations = (props) => {

  const nominationsContainer = useRef(null)

  // force scroll effects for mobile
  useEffect(() => { 
    
    // scroll to latest nomination after each nomination added
    if(props.nominatedMovies.length < 5) {
      nominationsContainer.current.scrollLeft = nominationsContainer.current.scrollWidth;
    } 

    // scroll to zero in window after every nomination
    if(window.innerWidth < 900) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); 
    }
  }, [props.nominatedMovies])

  return (
    <React.Fragment>

      <div className='nominations__header'>
        { props.nominatedMovies.length < 5 
          ? 'My Nominations' 
          : <img alt='Final Nominations' 
              className='nominations__ribbon fade-in' 
              src={process.env.PUBLIC_URL + 'ribbon.svg'} /> 
        }
      </div> 

      <div className='nominations__container' ref={ nominationsContainer }>
        {
          props.nominatedMovies.map((movie, i) => {
            return <div className='nominated' key={i}>
                <div className='nominated__image-wrapper'>
                  <MovieCard
                    classNames={'card__image card__image--large card__image--shadow'}
                    id={`nominated-image-${i}`}
                    title={ movie.Title }
                    posterUrl={ movie.Poster }
                    year={ movie.Year }
                    index={ i }
                  />

                  <div className='nominated__remove-button fade-in'
                    onClick={ () => { 
                      props.removeNomination(i);
                      props.setHoveredIcon(-1); 
                    }}
                    onMouseEnter={() => { props.setHoveredIcon(i) }}
                    onMouseLeave={() => { props.setHoveredIcon(-1) }}
                    >
                    <Icon source={CircleCancelMajorTwotone}
                      color={ (props.hoveredIcon === i) ? 'red' : 'inkLighter' } />
                  </div>
                </div>
                <p className='nominated__text fade-in'>{movie.Title}</p>
                <p className='nominated__text fade-in'>({movie.Year})</p>
              </div>
          })
        }
      </div>

      { // if there are 5 nominations, show continue button
      ( props.nominatedMovies.length === 5 ) && 
      <div className='submit'>
        <div onClick={() => { 
          props.setIsSubmitted(true);
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
          }} className='submit__button' >
          Continue →</div>
      </div>
      }

    </React.Fragment>
  );
} 

// this route appears after user submits the 5 nominations
const DisplayPortfolio = (props) => {
  return (
    <React.Fragment>
      <Confetti
        width={ window.innerWidth - 40 }
        height={ window.innerHeight - 40 }
        numberOfPieces={ 400 }
        tweenDuration={ 20000 }
        recycle={ false }
      />

      <div className='portfolio'>
        <DisplayText 
          element='h1'
          size='extraLarge'>
            Hooray! Your nominations have been recorded.
        </DisplayText>

        <p>Thank you for checking out my project. I hope you liked it!</p>
        <p>Please check out some of my other personal projects below:</p>

        <ul>
          <li><a href='https://color-cluster.netlify.app/' 
            target='_blank' rel="noopener noreferrer">Color Cluster</a></li>
          <li><a href='https://whatpharmacistsdo.org/' 
            target='_blank' rel="noopener noreferrer">WhatPharmacistsDo</a></li>
          <li><a href='https://www.jsongfitness.com/' 
            target='_blank' rel="noopener noreferrer">JSong Fitness</a></li>
        </ul>

          <div className='portfolio__links'>
            <a href='https://linkedin.com/in/henryliang2' 
              target='_blank' rel="noopener noreferrer"><LinkedIn style={{ fontSize: 48 }}/></a>
            <a href='https://github.com/henryliang2' 
              target='_blank' rel="noopener noreferrer"><GitHub style={{ fontSize: 48 }}/></a>
            <a href='mailto:henryliang@alumni.ubc.ca'><Email style={{ fontSize: 48 }}/></a>

          </div>

        <div className='submit'>
          <div className='submit__button'
            onClick={() => {
              props.setIsSubmitted(false);
            }} 
            >
            ← Change your Nominations
          </div>
          <div className='submit__button'
            onClick={() => {
              props.setNominatedMovies([]);
              props.setIsSubmitted(false);
            }} 
            >
            ← Undo All Nominations
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default NominationList
