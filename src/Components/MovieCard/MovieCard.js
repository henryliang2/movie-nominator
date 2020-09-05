import React from 'react';
import { Heading } from '@shopify/polaris';
import './MovieCard.css'

const MovieCard = (props) => {

  if ( props.posterUrl === 'N/A' ) {

    return (
      <div className='moviecard__blank-poster fade-in'
        id={`returned-image-${props.index}`}
        >
        <Heading>{ props.title }</Heading>
      </div>
    );

  } else if ( props.posterUrl ) {

    return (
      <img className='moviecard__image fade-in'
        alt={ props.title }
        id={`returned-image-${props.index}`}
        src={ props.posterUrl }
        onLoad={() => { 
          document.getElementById(`returned-image-${props.index}`)
          .classList.add('fade-in'); 
        }}
      />
    );
    
  }

  
}

export default MovieCard;