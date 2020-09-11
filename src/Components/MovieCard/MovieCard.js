import React, { useRef, useState } from 'react';
import { Heading, Spinner } from '@shopify/polaris';
import './MovieCard.css'

const MovieCard = (props) => {

  const imageRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  const [hasError, setHasError] = useState(false);

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
          setHasError(true);
        }}
        onLoad={() => { 
          imageRef.current.style.display = 'inline-block'
          setIsLoading(false);
          imageRef.current.classList.add('fade-in'); 
        }}
      />

      { isLoading &&
        <div className='moviecard__placeholder'>
          <Spinner size="small" color="teal" accessibilityLabel="Loading image .." />
        </div>
      }

      { (props.posterUrl === 'N/A' || hasError === true) && 
        <div className='nomination__poster-title'>
          <Heading>{ props.title }</Heading>
        </div>
      }

    </React.Fragment>
  );
  
}

export default MovieCard;