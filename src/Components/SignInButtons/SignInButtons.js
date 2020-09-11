import React, { useEffect, useRef } from 'react';
import { Spinner } from '@shopify/polaris';
import './SignInButtons.css'

const SignInButtons = (props) => {
  const signInButtons = useRef();
  const defaultSignInMessage = useRef();
  const processingSignInMessage = useRef();
  const errorSignInMessage = useRef();

  // update sign-in welcome/processing/error message when sign-in state changes
  useEffect(() => {
    if (!props.isSignedIn) {
      // reset all to display: none
      signInButtons.current.className = 'display-block';
      defaultSignInMessage.current.className = 'display-none';
      processingSignInMessage.current.className = 'display-none';
      errorSignInMessage.current.className = 'display-none';

      switch(props.signInMessage) {
        default:
          defaultSignInMessage.current.className = 'display-block';
          break;
        case 'default':
          defaultSignInMessage.current.className = 'display-block';
          break;
        case 'processing':
          signInButtons.current.className='display-none';
          processingSignInMessage.current.className = 'display-block';
          break;
        case 'error':
          errorSignInMessage.current.className = 'display-block';
          break;
      }
    }
  }, [props.signInMessage, props.isSignedIn])

  return (
    <div className='signin__container' >
      <div id='signin__buttons' ref={ signInButtons }>
        <div className='signin__button as-user' onClick={props.onSignIn}>
          <img alt='Sign-in button' 
            src={process.env.PUBLIC_URL + 'google_icon.svg'}
          />
          <p className='signin__text'>Sign in with Google</p>
        </div>
        <div className='signin__button as-guest' 
          onClick={() => {
            props.setIsSignedIn(true)
          }}>
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
  );
}

export default SignInButtons;