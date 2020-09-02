import React, { useState } from 'react';
import { TextField, Icon } from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import MovieList from './Components/MovieList/MovieList';
import NominationList from './Components/NominationList/NominationList'
import './App.css';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

function App() {

  const [inputField, setInputField] = useState('');
  const [returnedMovies, setReturnedMovies] = useState([]);
  const [nominatedMovies, setNominatedMovies] = useState([]);

  const getState = () => {
    console.log(returnedMovies);
    console.log(nominatedMovies)
  }

  const runOmdbApi = () => {
    fetch(`https://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}&type=movie`)
    .then(jsonData => jsonData.json())
    .then(result => {
      if(result.Response) {
        setReturnedMovies(result.Search) 
      }
    })
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
          </div>
        </div>
      }

        { /* ----- SearchBox ----- */}
        <form onSubmit={ (event) => {
          event.preventDefault();
          runOmdbApi();
        }}>

          <div>Please nominate 5 different movies</div>

          <TextField type='text'
            id='searchfield' 
            value={inputField}
            placeholder='Search Movies'
            prefix={<Icon source={SearchMinor} color="inkLighter" />}
            onChange={(e) => { setInputField(e)}}>
          </TextField>
        </form>

        { /* ----- Movies Returned from API Call ----- */}
        <MovieList
          movieArray={ returnedMovies }
          nominateMovie={ nominateMovie }
        />

        <button onClick={getState}>Get State</button>
      </div>
  );
}

export default App;
