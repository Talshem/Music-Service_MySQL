require('dotenv').config();
var mysql = require('mysql');
<<<<<<< Updated upstream
=======

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('./client/build'));


const cors = require('cors');
app.use(cors());
>>>>>>> Stashed changes

const user = process.env.user
const password = process.env.password

var con = mysql.createConnection({
  host: "localhost",
  user: user,
  password: password,
  database: "mydb",
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
<<<<<<< Updated upstream
=======
});


///////////////////////////////////////////////////////////////// Get TOP

  // Get top_songs
app.get('/top_songs', (req, res) => {
  let sql = `SELECT * FROM songs ORDER BY title`;
  con.query(sql,function (err, result) {
    if (err) throw err;
    res.send(result)
    })
      res.cookie({
    sameSite: 'none'
  })
  })

  // Get top_songs
app.get('/top_artists', (req, res) => {
  let sql = "SELECT * FROM artists ORDER BY name";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

  // Get top_songs 
app.get('/top_albums', (req, res) => {
  let sql = "SELECT * FROM albums ORDER BY name ";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

  // Get top_songs 
app.get('/top_playlists', (req, res) => {
  let sql = "SELECT * FROM playlists ORDER BY name";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

///////////////////////////////////////////////////////////////// Get 1


    // Get a song 
app.get('/song/:title', (req, res) => {
  let sql = `SELECT * FROM songs WHERE title = ${req.params.title}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

      // Get an artist
app.get('/artist/:name', (req, res) => {
  let sql = `SELECT * FROM artists WHERE name = ${req.params.name}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

      // Get an album
app.get('/album/:name', (req, res) => {
  let sql = `SELECT * FROM albums WHERE name = ${req.params.name}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

      // Get a song LIMIT 20
app.get('/playlist/:name', (req, res) => {
  let sql = `SELECT * FROM playlists WHERE name = ${req.params.name}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })


///////////////////////////////////////////////////////////////// POST


// POST song 
app.post('/song', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `INSERT INTO songs (title, album, artist, created_at, length, lyrics, track_number, upload_at, youtube_link) VALUES 
  (${body.title}, ${body.album}, ${body.artist}, ${body.created_at}, ${body.length}, ${body.lyrics}, ${body.track_number}, ${body.upload_at}, ${body.youtube_link})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});

// POST artist
app.post('/artist', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `INSERT INTO artists (name, cover_img, upload_at) VALUES 
  (${body.name}, ${body.cover_img}, ${body.upload_at})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// POST album 
app.post('/album', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `INSERT INTO albums (name, artist, cover_img, created_at, upload_at) VALUES 
  (${body.name}, ${body.artist}, ${body.cover_img}, ${body.created_at}, ${body.upload_at})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// POST playlist
app.post('/playlist', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `INSERT INTO playlists (name, cover_img, songs, created_at,  upload_at) VALUES 
  (${body.name}, ${body.cover_img}, ${body.songs}, ${body.created_at}, ${upload_at.length})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


///////////////////////////////////////////////////////////////// PUT

// PUT song
app.post('/song', (req, res) => {
const body = req.body;
console.log(body)
let sql = `UPDATE songs SET title = ${body.title}, album = ${body.album}, artist = ${body.artist},
created_at = ${body.created_at}, length = ${body.length}, lyrics = ${body.lyrics}, track_number = ${body.track_number},
upload_at = ${body.upload_at}, youtube_link = ${body.youtube_link} WHERE id = ${body.id} `
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

// PUT artist
app.post('/artist', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `UPDATE artists SET name = ${body.name}, cover_img = ${body.cover_img}, upload_at = ${body.upload_at} WHERE id = ${body.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// PUT album 
app.post('/album', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `UPDATE albums SET name = ${body.name}, artist = ${body.artist}, cover_img = ${body.cover_img},
  created_at = ${body.created_at}, upload_at = ${body.upload_at} WHERE id = ${body.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// PUT playlist
app.post('/playlist', (req, res) => {
const body = req.body;
console.log(body)
  let sql = `UPDATE playlists SET name = ${body.name}, cover_img = ${body.cover_img}, songs = ${body.songs},
  created_at = ${body.created_at}, upload_at = ${upload_at.length} WHERE id = ${body.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


///////////////////////////////////////////////////////////////// DELETE

// DELETE song
app.delete('/song/:title', (req, res) => {
var sql = `DELETE FROM songs WHERE title = ${req.params.title}, id = ${body.id}`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

// DELETE album
app.delete('/album/:name', (req, res) => {
var sql = `DELETE FROM albums WHERE name = ${req.params.name}, id = ${body.id}`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

// DELETE artist
app.delete('/artist/:name', (req, res) => {
var sql = `DELETE FROM artists WHERE name = ${req.params.name}, id = ${body.id}`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

// DELETE playlist
app.delete('/playlist/:name', (req, res) => {
var sql = `DELETE FROM playlists WHERE name = ${req.params.name}, id = ${body.id}`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

///////////////////////////////////////////////////////
const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
>>>>>>> Stashed changes
});