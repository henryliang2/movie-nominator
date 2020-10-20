## Movie Nominator App
It's time to nominate your favourite films for this year's awards! 
Made using ReactJS and Firebase for authentication and database services.  
  
See the live hosted app at [https://movie-nominator.netlify.app](https://movie-nominator.netlify.app)

## Demonstration  
  
Desktop | Mobile
------------ | -------------
![](public/demo.gif) | ![](public/demo-mobile.gif)
  
## Design Notes   
**User Experience**  
  
This app was designed and built with user experience and usability principles in mind. I made sure to focus on simplicity, minimalism, and providing the user with each new task in a clear and stepwise fashion. The UI elements were made to be intuitive and easy for the user to discover organically. UI elements are also removed when appropriate in order to limit any confusion.  After the user nominates their final movie, the interface changes stylistically to imbue a strong sense of gravity in the user's actions.
    
![](public/ux-flow.png)
    
**Data Model**  
  
The Movie Nominator uses a document-oriented model for storage of each user's nominated movies.
  
```
{
  "users": {
    "lABAVxR1WUYCSQo4wwuRIXRNMwp2": {
      "email": "example@gmail.com",
      "nominatedMovies": [
        {
          "Title": "The Martian",
          "Poster": "https://m.media-amazon.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg",
          "Type": "movie",
          "Year": "2015",
          "imdbID": "tt3659388"
        },
        {
          "Title": "Inception",
          "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
          "Type": "movie",
          "Year": "2010",
          "imdbID": "tt1375666"
        }
      ]
    }
  }
}
```

## External Resources Used
[OMDb API](http://www.omdbapi.com/), [Firebase API](https://firebase.google.com/), [Shopify Polaris](https://polaris.shopify.com/), [Material UI Icons](https://material-ui.com/), [react-confetti](https://www.npmjs.com/package/react-confetti)
