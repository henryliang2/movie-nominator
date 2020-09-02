import React, { useEffect, useState } from 'react';
import { TextField, DisplayText } from '@shopify/polaris';
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
    fetch(`http://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}`)
    .then(jsonData => jsonData.json())
    .then(result => { setReturnedMovies(result.Search) });
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

        {/* ----- Title ----- */}
        <DisplayText size='extraLarge'>Nominations</DisplayText>

        { /* ----- SearchBox ----- */}
        <form onSubmit={ (event) => {
          event.preventDefault();
          runOmdbApi();
        }}>

          <TextField type='text'
            id='searchfield' 
            value={inputField}
            placeholder='Search ..'
            onChange={(e) => { setInputField(e)}}>
          </TextField>
        </form>

        { /* ----- Movie Search List ----- */}
        <MovieList
          listType={'search'}
          movies={ returnedMovies }
          nominateMovie={ nominateMovie}
        />

        <button onClick={getState}>Get State</button>
      </div>
  );
}

export default App;
