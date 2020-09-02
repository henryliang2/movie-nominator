import React from 'react';

const NominationList = (props) => {

  if (props.nominatedMovies.length < 1) {
    return null
  } else {
    return (
      <React.Fragment>
        <div>My Nominations</div>
        
        {
          props.nominatedMovies.map((movie, i) => {
            return <div className='nomination__container'>
            
            <div className='nomination__moviecard'>
            <img 
              alt={movie.Title}
              src={movie.Poster} 
              width='100'
              height='150'
              /></div>

            </div>
          })
        }

      </React.Fragment>
      );
  }
}

export default NominationList