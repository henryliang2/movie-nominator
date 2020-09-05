import React from 'react';
import { Heading } from '@shopify/polaris';
import './MovieCard.css'

const MovieCard = (props) => {

  if ( props.posterUrl === 'N/A' ) {

    return (
      <div className='moviecard__blank-poster'
        id={`returned-image-${props.index}`}
        >
        <Heading>{ props.title }</Heading>
      </div>
    );

  } else if ( props.posterUrl ) {

    return (
      <img className='moviecard__image'
        alt={ props.title }
        id={`returned-image-${props.index}`}
        src={ props.posterUrl }
        onLoad={() => { props.fadeInImage(`returned-image-${props.index}`) }}
      />
    );
    
  }

  
}

export default MovieCard;