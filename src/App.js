import React, { useEffect, useState } from 'react';
import { TextField, DisplayText } from '@shopify/polaris';
import MovieList from './Components/MovieList/MovieList';
import './App.css';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

function App() {

  const [inputField, setInputField] = useState('');
  const [returnedMovies, setReturnedMovies] = useState([])

  useEffect(() => {
  }, [])

  const getState = () => {
    console.log(returnedMovies)
  }

  const runOmdbApi = () => {
    fetch(`http://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}`)
    .then(jsonData => jsonData.json())
    .then(result => { setReturnedMovies(result.Search) });
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
            value={inputField}
            placeholder='Search ..'
            onChange={(e) => { setInputField(e); console.log(e)}}>
          </TextField>
        </form>

        { /* ----- Movie List ----- */}
        <MovieList
          returnedMovies={ returnedMovies }
        />

        <button onClick={getState}>Get State</button>
      </div>
  );
}

export default App;
