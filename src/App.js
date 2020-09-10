import React, { useState, useEffect } from 'react';
import { TextField, Icon, DisplayText, Button, Spinner } from '@shopify/polaris';
import { SearchMinor, LogOutMinor } from '@shopify/polaris-icons';
import ReturnedList from './Components/ReturnedList/ReturnedList';
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
  const [isReturnPopulated, setIsReturnPopulated] = useState(true);

  const [isSignedIn, setIsSignedIn] = useState(false);

  // user object from firebase, has access to user.uid, user.email, etc
  const [user, setUser] = useState(null);

  const runOmdbApi = () => {
    setReturnedMovies([]);
    setAwaitingApiResponse(true);
    fetch(`https://www.omdbapi.com/?s=*${inputField}*&apikey=${API_KEY}&type=movie`)
    .then(jsonData => jsonData.json())
    .then(result => {
      if (result.Response === 'True') {
        setReturnedMovies(result.Search);
        setIsReturnPopulated(true); 
      } else {
        setIsReturnPopulated(false);
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

  const onSignIn = async () => {
    const buttons = document.getElementById('signin__button-container')
    const descriptionMessage = document.getElementById('signin__description');
    const spinner = document.getElementById('signin__processing');
    const errorMessage = document.getElementById('signin__error');

    spinner.style.display = 'inline';
    buttons.style.display='none';
    descriptionMessage.style.display = 'none';
    errorMessage.style.display = 'none';

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
      buttons.style.display='block';
      errorMessage.style.display = 'inline';
      spinner.style.display = 'none';
    }
  }

  const onSignOut = () => {
    setInputField('');
    setReturnedMovies([])
    setUser(null);
    setIsSignedIn(false);
    setIsReturnPopulated(true);
    setNominatedMovies([]);
  }
  
  useEffect(() => {
    // update database every time nominatedMovies state is changed
    if (isSignedIn && user) {
      const databaseRef = db.collection(user.uid).doc('nominatedMovies');
      databaseRef.set({ nominatedMovies: nominatedMovies })
    }
  }, [nominatedMovies]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <div className='layout__container' id='nomination-container'>
        <div className='layout__section'>

          {/* 
            Display nominated movies if there are any,
            otherwise display welcome message
          */}

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
        
          {/* Display signin buttons ONLY IF not signed in */}
          { !isSignedIn &&
            <div className='signin__container'>
              <div id='signin__button-container'>
                <div className='signin__button as-user' onClick={onSignIn}>
                  <img alt='Sign-in button' src={process.env.PUBLIC_URL + 'google_icon.svg'}/>
                  <p className='signin__text'>Sign in with Google</p>
                </div>
                <div className='signin__button as-guest' onClick={() => {setIsSignedIn(true)}}>
                  Sign in as Guest
                </div>
              </div>
              <div id='signin__description'>
                We ask you to sign in so that your progress can be saved 
                if you decide to come back later. 
              </div>
              <div id='signin__processing'>
                <Spinner size="large" color="teal" accessibilityLabel="Signing in ..." />
                <br/><br/>
                Signing you in ...
              </div>
              <div id='signin__error'>
                There was an error signing you in.
              </div>
            </div>
          }

          {/* 
            Display Searchbox and Returned movies ONLY IF there are fewer than 5 movies nominated
           */}

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
              { isReturnPopulated
                ? <ReturnedList
                    returnedMovies={ returnedMovies }
                    nominatedMovies={ nominatedMovies}
                    nominateMovie={ nominateMovie }
                    awaitingApiResponse={ awaitingApiResponse }
                  />
                : <div className='returnedlist__search-failed'>No movies found with that search =(</div>
              }
            </React.Fragment>
          }
      </div>
      { isSignedIn &&
        <div className='signout__button'>
          <Button outline monochrome 
            icon={ LogOutMinor } 
            onClick={onSignOut}
            >
              Log out
          </Button>
        </div>
      }

    </div>
  </React.Fragment>
  );
}

export default App;
