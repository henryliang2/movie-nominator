import React from 'react'
import './Footer.css'

const Footer = () => {

  const links = [
    ['@shopify/polaris', 'https://polaris.shopify.com/'],
    ['OMDb API', 'http://www.omdbapi.com/']
  ]

  return (
    <div className='footer__container'>
      <p className='footer footer__title'>Packages Used</p>
      { links.map(link => {
          return (
            <a className='footer footer__link' href={ link[1] }>{ link[0] }</a>
          );
        }) }
    </div>
  );
}

export default Footer