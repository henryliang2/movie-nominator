import React, { useState } from 'react';
import { TextField, Icon } from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import MovieList from './Components/MovieList/MovieList';
import NominationList from './Components/NominationList/NominationList'
import './App.css';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

function App() {

  const [inputField, setInputField] = useState('');

  // an array of movies returned from API call
  const [returnedMovies, setReturnedMovies] = useState([]); 

  // an array of movies that the user has nominated
  const [nominatedMovies, setNominatedMovies] = useState([]);

  // true if API has been called and no response received yet, false otherwise
  const [awaitingApiResponse, setAwaitingApiResponse] = useState(false);

  // boolean; true if at least one movie returned from query, false otherwise
  // initial state is true so that 'no movies found' is not showing
  const [moviesReturned, setMoviesReturned] = useState(true);

  const runOmdbApi = () => {
    setAwaitingApiResponse(true);
    fetch(`https://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}&type=movie`)
    .then(jsonData => jsonData.json())
    .then(result => {
      if(result.Response === 'True') {
        setReturnedMovies(result.Search);
        setMoviesReturned(true); 
      } else {
        setMoviesReturned(false);
      }
    })
    .then(setAwaitingApiResponse(false))
    setInputField('');
  }

  const nominateMovie = (idx) => {
    if ( nominatedMovies.length >= 5 ) {
      return null
    }
    setNominatedMovies(prevState => {
      return [...prevState, returnedMovies[idx]]
    });
    console.log(nominatedMovies);
    setReturnedMovies([]);
  } 

  const removeNomination = (idx) => {
    let updatedNominationList = Object.assign([], nominatedMovies);
    console.log('object.assign', updatedNominationList)
    updatedNominationList.splice(idx, 1);
    setNominatedMovies(updatedNominationList);
  }

  return (
      <div className='main__container'>

      { (nominatedMovies.length > 0 ) 

        ? <NominationList 
          nominatedMovies={ nominatedMovies }
          removeNomination={ removeNomination }
        />

        : <div className='welcome__container'>
          <img id='shoppies-logo' 
            alt='Shoppies Award Logo' 
            src={process.env.PUBLIC_URL + 'award_logo.svg'} />
          <div className='welcome__title'>It's Time for Nominations!</div>
          <div className='welcome__subtext'>
            <p>The annual Shoppies<sup>TM</sup> awards are approaching quickly!</p>
            <p>Which films made you laugh or cry (of happiness)?</p>
            <p><br /></p>
            <p>Please nominate five movies.</p>
          </div>
        </div>
      }

      {/* ----- Remove searchbox when # of nominated movies hits 5 -----*/}
      { (nominatedMovies.length < 5) &&
        <React.Fragment>
        { /* ----- SearchBox ----- */}
          <form id='searchfield'
            onSubmit={ (event) => {
              event.preventDefault();
              runOmdbApi(); }}
            >

            <TextField type='text' 
              value={inputField}
              placeholder='Search Movies'
              prefix={<Icon source={SearchMinor} color="inkLighter" />}
              onChange={(e) => { setInputField(e)}}>
            </TextField>
          </form>

          { /* ----- Movies Returned from API Call ----- */}
          { moviesReturned

            ? <MovieList
                movieArray={ returnedMovies }
                nominatedMovies={ nominatedMovies}
                nominateMovie={ nominateMovie }
                awaitingApiResponse={ awaitingApiResponse }
              />

            : <div className='movielist__search-failed'>No movies found with that search =(</div>
          }

        </React.Fragment>
      }

      </div>
  );
}

export default App;
