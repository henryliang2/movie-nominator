import React, { useState, useEffect, useRef } from 'react';
import { TextField, Icon, DisplayText, Button } from '@shopify/polaris';
import { SearchMinor, LogOutMinor } from '@shopify/polaris-icons';
import ReturnedList from './Components/ReturnedList/ReturnedList';
import NominationList from './Components/NominationList/NominationList'
import SignInButtons from './Components/SignInButtons/SignInButtons'
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

  // background color of top container; normal = #1C2260 ; darken = #1f0f38
  const [backgroundColor, setBackgroundColor] = useState('#1C2260');

  // Display message based on signInMessage
  // signInMessage: 0 = default/welcome; 1 = processing sign-in; 2 = error
  const [signInMessage, setSignInMessage] = useState('default');

  const nominationsContainer = useRef();

  const runOmdbApi = () => {
    setReturnedMovies([]); // clear any existing movies from previous API call
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
    // after first query on mobile, scroll to returned movie to guide user's eyes
    if (window.innerWidth < 1025 && nominatedMovies.length < 1) { 
      window.scrollTo(0, 360) 
    }
  }

  const nominateMovie = (idx) => {
    // Can't nominate more than 5 movies
    if ( nominatedMovies.length >= 5 ) {
      return null
    }
    // remove all images from 'returned images' section
    setReturnedMovies([]); 
    setNominatedMovies(prevState => {
      return [...prevState, returnedMovies[idx]]
    });
    // refocus inputField
    if (nominatedMovies.length < 5) {
      document.getElementsByClassName('Polaris-TextField__Input')[0].focus();
    }
  } 

  const removeNomination = (idx) => {
    let newList = Object.assign([], nominatedMovies);
    newList.splice(idx, 1);
    setNominatedMovies(newList);
  }

  const onSignIn = async () => {
    setSignInMessage('processing'); // display 'processing sign-in' message
    try {
      const result = await firebase.auth().signInWithPopup(provider)
      await setUser(result.user);

      // get nominations from database and set as nominatedMovies state
      const databaseRef = db.collection('users').doc(result.user.uid);
      const returnRef = await databaseRef.get()
      if (returnRef.exists) {
        const returnedData = returnRef.data();
        setNominatedMovies(returnedData.nominatedMovies);
      }
      setSignInMessage('default'); // signInMessage: 0 = default/welcome message
      setIsSignedIn(true);
    } 
    catch(err) { 
      console.log(err)
      setSignInMessage('error') // show error message
    } 
  }

  const onSignOut = () => {
    setInputField('');
    setReturnedMovies([])
    setUser(null);
    setIsSignedIn(false);
    setIsReturnPopulated(true);
    // setNominatedMovies MUST COME AFTER setUser and setIsSignedIn, or else
    // it will trigger a useEffect when it clears the state and then update 
    // the database to be an empty array. >=((((
    setNominatedMovies([]);
    setSignInMessage('default'); // signInMessage: 0 = default/welcome message
  }
  
  // update database every time nominatedMovies state is changed
  useEffect(() => {
    if (isSignedIn && user) {
      const databaseRef = db.collection('users').doc(user.uid);
      databaseRef.set({ 
        email: user.email,
        nominatedMovies: nominatedMovies 
      })
    }
  }, [nominatedMovies]) // eslint-disable-line react-hooks/exhaustive-deps

  // darken background and scroll to top IF signed in and 5 nominations 
  useEffect(() => {
    if (isSignedIn && (nominatedMovies.length === 5)){
      setBackgroundColor('#1f0f38') // set to darken
      window.scrollTo(0, 0);
    } else {
      setBackgroundColor('#1C2260') // set to initial
    }
  }, [nominatedMovies.length, isSignedIn])

  useEffect(() => {
    nominationsContainer.current.style.background = backgroundColor; 
  })

  return (
    <React.Fragment>
      {
        // ----- Nominations Container -----
      }
      <div className='layout' id='nomination-container' ref={ nominationsContainer }>
        <div className='layout__section'>

          { // Display nominated movies if there are any, otherwise display welcome message
          nominatedMovies.length > 0
            ? <NominationList 
                nominatedMovies={ nominatedMovies }
                removeNomination={ removeNomination }
                setNominatedMovies={ setNominatedMovies }
                isSignedIn={ isSignedIn }
            />
            : <div className='welcome'>
                <img className='welcome__logo' 
                  alt='Shoppies Award Logo' 
                  src={process.env.PUBLIC_URL + 'award_logo.svg'} />
                <div className='welcome__title'>It's time to nominate your favourite films.</div>
              </div> 
          }
        </div>
      </div>

      {
        // ----- Searchbox and API Response container -----
      }
      <div className='layout'>
        <div className='layout__section'>

          {// Display signin buttons ONLY IF not signed in
            !isSignedIn &&
            <SignInButtons
              onSignIn={ onSignIn }
              setIsSignedIn={ setIsSignedIn }
              signInMessage={ signInMessage }
            />
          }

          {// Display Searchbox and Returned movies ONLY IF there are fewer than 5 movies nominated
            (nominatedMovies.length < 5 && isSignedIn) &&
            <React.Fragment>
              <div className='search__header'>
                <DisplayText> Please nominate five movies for this year's awards.</DisplayText>
              </div>
              <form className='search__form'
                onSubmit={ (event) => {
                  event.preventDefault();
                  runOmdbApi(); }}
              >
                <TextField autoFocus
                  type='text'
                  value={inputField}
                  placeholder='Search for a Movie'
                  prefix={<Icon source={SearchMinor} color="inkLighter" />}
                  onChange={(e) => { setInputField(e)}}>
                </TextField>
              </form>

              { /// Displey Movies Returned from API call only if movies returned
                isReturnPopulated
                ? <ReturnedList
                    returnedMovies={ returnedMovies }
                    nominatedMovies={ nominatedMovies}
                    nominateMovie={ nominateMovie }
                    awaitingApiResponse={ awaitingApiResponse }
                  />
                : <div className='search__failed-message'>No movies found with that search =(</div>
              }
            </React.Fragment>
          }
      </div>
      
      { // Display signout button only if already signed in
        isSignedIn &&
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