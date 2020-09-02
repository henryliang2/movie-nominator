import React from 'react';
import { Heading } from '@shopify/polaris';
import './MovieCard.css'

const MovieCard = (props) => {

  if ( props.posterUrl === 'N/A' ) {

    return (
      <div className='poster__blank'>
        <Heading>{ props.title }</Heading>
      </div>
    );

  } else if ( props.posterUrl ) {

    return (
      <img alt={ props.title }
        src={ props.posterUrl }
        width='120px'
        height='180px'
      />
    );
    
  }

  
}

export default MovieCard;