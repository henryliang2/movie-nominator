import React, { useRef } from 'react';
import { Heading } from '@shopify/polaris';
import './MovieCard.css'

const MovieCard = (props) => {

  const imageRef = useRef(null);

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
      <img className='moviecard__image'
        alt={ props.title }
        ref={imageRef}
        id={`returned-image-${props.index}`}
        src={ props.posterUrl }
        onError={() => {
          imageRef.current.src=`${process.env.PUBLIC_URL}indigoDark.png`
        }}
        onLoad={() => { 
          imageRef.current.classList.add('fade-in'); 
        }}
      />
    );
    
  }

  
}

export default MovieCard;