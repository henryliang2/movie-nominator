import React, { useRef, useState } from 'react';
import { Heading } from '@shopify/polaris';
import './MovieCard.css'

const MovieCard = (props) => {

  const imageRef = useRef(null);

  const [hasImageError, setHasImageError] = useState(false);

  return (
    <React.Fragment>
      <img className={ props.classNames }
        alt={ props.title }
        ref={imageRef}
        id={props.id}
        src={ (props.posterUrl !== 'N/A')
          ? props.posterUrl
          : `${process.env.PUBLIC_URL}poster-blank.jpg`
        }
        onError={() => {
          imageRef.current.src=`${process.env.PUBLIC_URL}poster-blank.jpg`;
          setHasImageError(true);
        }}
        onLoad={() => { 
          imageRef.current.classList.add('fade-in'); 
        }}
      />
      {/* only show poster-title if poster is N/A or there is an error */}
      { (props.posterUrl === 'N/A' || hasImageError === true) && 
        <div className='nomination__poster-title'>
          <Heading>{ props.title }</Heading>
        </div>
      }

    </React.Fragment>
  );
  
}

export default MovieCard;