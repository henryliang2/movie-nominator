import React, { useState } from 'react';
import { TextField, Icon, DisplayText } from '@shopify/polaris';
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
  const [isPopulated, setIsPopulated] = useState(true);

  const runOmdbApi = () => {
    setReturnedMovies([]);
    setAwaitingApiResponse(true);
    fetch(`https://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}&type=movie`)
    .then(jsonData => jsonData.json())
    .then(result => {
      if(result.Response === 'True') {
        setReturnedMovies(result.Search);
        setIsPopulated(true); 
      } else {
        setIsPopulated(false);
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
    setReturnedMovies([]); // remove all images from 'returned images' section
    try {
      if (nominatedMovies.length < 5) {
        document.getElementsByClassName('Polaris-TextField__Input')[0].focus();
      }
    } catch(err) {
      console.log(err)
    }
  } 

  const removeNomination = (idx) => {
    let updatedNominationList = Object.assign([], nominatedMovies);
    updatedNominationList.splice(idx, 1);
    setNominatedMovies(updatedNominationList);
  }

  return (
    <React.Fragment>
      <div className='layout__container'>
        <div className='layout__section'>

          {/* ---- Display nominated movies if there are any, otherwise display welcome */}
          { (nominatedMovies.length > 0 ) 

            ? <NominationList 
              nominatedMovies={ nominatedMovies }
              removeNomination={ removeNomination }
              setNominatedMovies={ setNominatedMovies }
            />

            : <div className='welcome__container'>
              <img id='shoppies-logo' 
                alt='Shoppies Award Logo' 
                src={process.env.PUBLIC_URL + 'award_logo.svg'} />
              <div className='welcome__title'>It's time to nominate your favourite films.</div>
            </div>
          }
        </div>
      </div>

      <div className='layout__container'>
        <div className='layout__section'>
          {/* ----- Remove searchbox when # of nominated movies hits 5 -----*/}
          { (nominatedMovies.length < 5) &&
            <React.Fragment>

            <div className='searchfield__header'>
              <DisplayText> Please nominate five movies for this year's awards.</DisplayText>
            </div>
            
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

              { /* ----- Movies Returned from API Call (Display only if there are movies returned) ----- */}
              { isPopulated

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
    </div>
  </React.Fragment>
  );
}

export default App;
