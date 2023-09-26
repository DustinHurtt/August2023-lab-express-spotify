require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

app.get('/', (req, res, next) => {

    res.render('index.hbs')

})

app.get("/artist-search", (req, res, next) => {
  let { artist } = req.query;
  console.log("this is the artist queried", artist);

  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      let results = data.body.artists.items;
      console.log("The received data from the API: ", results[0]);
      res.render("artist-search-results.hbs", { results });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {
  let { artistId } = req.params;
  spotifyApi
    .getArtistAlbums(artistId)
    .then((result) => {
        let results = result.body.items
        console.log("These are the found albums", results[0]);
        res.render('albums.hbs', { results })
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get('/tracks/:trackId', (req, res, next) => {

    let { trackId } = req.params

    spotifyApi
    .getAlbumTracks(trackId)
    .then((data) => {
        let tracks = data.body.items
        console.log("Tracks from api:", data.body.items)
        res.render('tracks.hbs', { tracks })
    })
    .catch((err) =>
        console.log("The error while searching artists occurred: ", err)
  );

})

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
