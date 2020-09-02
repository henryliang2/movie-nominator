import React, { useState } from 'react';
import { TextField, Icon } from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import MovieList from './Components/MovieList/MovieList';
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
    fetch(`http://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}&type=movie`)
    .then(jsonData => jsonData.json())
    .then(result => { 
      console.log(result.Response)
      if(result.Response) {
        setReturnedMovies(result.Search) 
      }
    });
    setInputField('');
  }

  const nominateMovie = (idx) => {
    setNominatedMovies(prevState => {
      return [...prevState, returnedMovies[idx]]
    });
    console.log(nominatedMovies);
  } 

  return (
      <div className='main__container'>

        <div className='welcome__container'>
          <img 
            id='shoppies-logo' 
            alt='Shoppies Award Logo' 
            src={process.env.PUBLIC_URL + 'award_logo.svg'} />
          <div className='welcome__title'>It's Time for Nominations!</div>
          <div className='welcome__subtext'>
            <p>The annual Shoppies<sup>TM</sup> awards are approaching quickly!</p>
            <p>Please choose five of your favourite
            movies to nominate for the awards.</p>
          </div>
        </div>

        { /* ----- SearchBox ----- */}
        <form onSubmit={ (event) => {
          event.preventDefault();
          runOmdbApi();
        }}>

          <TextField type='text'
            id='searchfield' 
            value={inputField}
            placeholder='Search Movies'
            prefix={<Icon source={SearchMinor} color="inkLighter" />}
            onChange={(e) => { setInputField(e)}}>
          </TextField>
        </form>

        { /* ----- Movie Search List ----- */}
        <MovieList
          movieArray={ returnedMovies }
          nominateMovie={ nominateMovie }
        />

        <button onClick={getState}>Get State</button>
      </div>
  );
}

export default App;
