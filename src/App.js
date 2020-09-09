import React, { useState, useEffect } from 'react';
import { TextField, Icon, DisplayText } from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import MovieList from './Components/MovieList/MovieList';
import NominationList from './Components/NominationList/NominationList'
import firebaseConfig from './firebaseConfig';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import './App.css';

firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

function App() {

  const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

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

  const [isSignedIn, setIsSignedIn] = useState(false);

  const [user, setUser] = useState({});

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
    // remove all images from 'returned images' section
    setReturnedMovies([]); 
    setNominatedMovies(prevState => {
      return [...prevState, returnedMovies[idx]]
    });

    // refocus inputField
    try {
      if (nominatedMovies.length < 5) {
        document.getElementsByClassName('Polaris-TextField__Input')[0].focus();
      }
    } catch(err) { console.log(err) }
  } 

  const removeNomination = (idx) => {
    let updatedNominationList = Object.assign([], nominatedMovies);
    updatedNominationList.splice(idx, 1);
    setNominatedMovies(updatedNominationList);
  }

  const signInWithFirebase = async () => {
    const descriptionMessage = document.getElementById('signin__description');
    const processingMessage = document.getElementById('signin__processing');
    const errorMessage = document.getElementById('signin__error');

    descriptionMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    processingMessage.style.display = 'inline';

    try {
      const result = await firebase.auth().signInWithPopup(provider)
      await setUser(result.user);

      // get nominations from database and set back into state
      const databaseRef = db.collection(result.user.uid).doc('nominatedMovies');
      const returnRef = await databaseRef.get()
      if (returnRef.exists) {
        const returnedData = returnRef.data();
        setNominatedMovies(returnedData.nominatedMovies);
      }
      setIsSignedIn(true);
    } 

    catch(err) {
      processingMessage.style.display = 'none';
      errorMessage.style.display = 'inline';
    }
  }
  
  useEffect(() => {
    // update database every time nominatedMovies state is changed
    if (isSignedIn) {
      const databaseRef = db.collection(user.uid).doc('nominatedMovies');
      databaseRef.set({ nominatedMovies: nominatedMovies })
    }
  })

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

          { !isSignedIn &&
            <div className='signin__container'>
              <div className='signin__button' onClick={signInWithFirebase}>
                <img alt='Sign-in button' src={process.env.PUBLIC_URL + 'google_icon.svg'}/>
                <p className='signin__text'>Sign in with Google</p>
              </div>
              <p id='signin__description'>
                We ask you to sign in so that we can <br/>
                save your progress if you leave the page.
              </p>
              <p id='signin__processing'>
                Signing you in ...
              </p>
              <p id='signin__error'>
                There was an error signing you in.
              </p>
            </div>
          }

          {/* ----- Display Searchbox and Returned movies only if nominated movies is 5 -----*/}
          { (nominatedMovies.length < 5 && isSignedIn) &&

            <React.Fragment>
              <div className='searchfield__header'>
                <DisplayText> Please nominate five movies for this year's awards.</DisplayText>
              </div>
              <form id='searchfield'
                onSubmit={ (event) => {
                  event.preventDefault();
                  runOmdbApi(); }}
              >
                <TextField autoFocus
                  type='text'
                  value={inputField}
                  placeholder='Search Movies'
                  prefix={<Icon source={SearchMinor} color="inkLighter" />}
                  onChange={(e) => { setInputField(e)}}>
                </TextField>
              </form>

              { /* ----- Movies Returned from API Call (Display only if movies returned) ----- */}
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
