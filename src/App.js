import React, { useState, useEffect, useRef } from 'react';
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

  // background color of top container; normal = #1C2260 ; darken = #1f0f38
  const [backgroundColor, setBackgroundColor] = useState('#1C2260')

  // Display message based on signInStatus
  // signInStatus: 0 = default/welcome; 1 = processing sign-in; 2 = error
  const [signInStatus, setSignInStatus] = useState(0)
  const signInButtons = useRef(null)
  const defaultSignInMessage = useRef(null)
  const processingSignInMessage = useRef(null)
  const errorSignInMessage = useRef(null)
  const nominationsContainer = useRef(null)

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
    if (window.innerWidth < 800) { window.scrollTo(0, 600) }
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

    setSignInStatus(1); // processing message displayed

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
      setSignInStatus(0);
      setIsSignedIn(true);
    } 
    catch(err) { 
      console.log(err)
      setSignInStatus(2) // error message
    } 
  }

  const onSignOut = () => {
    setInputField('');
    setReturnedMovies([])
    setUser(null);
    setIsSignedIn(false);
    setIsReturnPopulated(true);
    setNominatedMovies([]);
    setSignInStatus(0);
  }

  // update sign-in welcome/processing/error message when sign-in state changes
  useEffect(() => {
    // reset all to display: none
    if (!isSignedIn) {
      signInButtons.current.className = 'display-block';
      defaultSignInMessage.current.className = 'display-none';
      processingSignInMessage.current.className = 'display-none';
      errorSignInMessage.current.className = 'display-none';

      switch(signInStatus) {
        default:
          defaultSignInMessage.current.className = 'display-block';
          break;
        case 0: // welcome or default
          defaultSignInMessage.current.className = 'display-block';
          break;
        case 1: // processing
          signInButtons.current.className='display-none';
          processingSignInMessage.current.className = 'display-block';
          break;
        case 2: // error
          errorSignInMessage.current.className = 'display-block';
          break;
      }
    }
  }, [signInStatus, isSignedIn])
  
  // update database every time nominatedMovies state is changed
  useEffect(() => {
    if (isSignedIn && user) {
      const databaseRef = db.collection(user.uid).doc('nominatedMovies');
      databaseRef.set({ nominatedMovies: nominatedMovies })
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
    nominationsContainer.current.style.background = backgroundColor; // update
  })

  return (
    <React.Fragment>
      <div className='layout__container' id='nomination-container' ref={ nominationsContainer }>
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
                isSignedIn={ isSignedIn }
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
            <div className='signin__container' >
              <div id='signin__buttons' ref={ signInButtons }>
                <div className='signin__button as-user' onClick={onSignIn}>
                  <img alt='Sign-in button' src={process.env.PUBLIC_URL + 'google_icon.svg'}/>
                  <p className='signin__text'>Sign in with Google</p>
                </div>
                <div className='signin__button as-guest' onClick={() => {setIsSignedIn(true)}}>
                  Sign in as Guest
                </div>
              </div>
              <div ref={ defaultSignInMessage } id='signin__description'>
                We ask you to sign in so that your progress can be saved 
                if you decide to come back later. 
              </div>
              <div ref={ processingSignInMessage } id='signin__processing'>
                <Spinner size="large" color="teal" accessibilityLabel="Signing in ..." />
                <br/><br/>
                Signing you in
              </div>
              <div ref={ errorSignInMessage } id='signin__error'>
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
                  placeholder='Search for a Movie'
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
