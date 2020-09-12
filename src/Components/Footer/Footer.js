import React from 'react'
import './Footer.css'

const Footer = () => {

  const links = [
    ['OMDb API', 'http://www.omdbapi.com/'],
    ['Firebase API', 'https://firebase.google.com/'],
    ['shopify/polaris', 'https://polaris.shopify.com/'],
    ['material-ui/icons', 'https://material-ui.com/'],
    ['react-confetti', 'https://www.npmjs.com/package/react-confetti'],
  ]

  return (
    <div className='footer'>
      <p className='footer__text footer__text--title'>Packages Used</p>
      { links.map((link, i) => {
          return (
            <a 
              className='footer__text footer__text--link' 
              href={ link[1] }
              key={i}
              >
                { link[0] }
            </a>
          );
        }) }

      <br/>
    </div>
  );
}

export default Footer