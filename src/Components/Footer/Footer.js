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
    <div className='footer__container'>
      <p className='footer footer__title'>Packages Used</p>
      { links.map((link, i) => {
          return (
            <a 
              className='footer footer__link' 
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