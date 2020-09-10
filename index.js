require('dotenv').config();
var mysql = require('mysql');

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('./client/build'));


const cors = require('cors');
app.use(cors());

const user = process.env.user
const password = process.env.password

var con = mysql.createConnection({
  host: "localhost",
  user: user,
  password: password,
  database: "mydb",
  multipleStatements: true,
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

///////////////////////////////////////////////////////////////// USER

    // login user
app.put('/users', (req, res) => {
const body = req.body
var date = new Date();
  con.query(`
UPDATE users SET remember_token = 0;
UPDATE users SET remember_token = 1 WHERE email = '${body.email}' AND password = '${body.password}';
UPDATE users SET upload_at = '${date.toISOString().substring(0, 10)}' WHERE email = '${body.email}' AND password = '${body.password}';
SELECT * FROM users WHERE email = '${body.email}' AND password = '${body.password}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[3])
    })
  })

      // logout user
app.put('/logout', (req, res) => {
  con.query(`
UPDATE users SET remember_token = 0;
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result)
    })
  })

// Get remembered user
app.get('/token', (req, res) => {
var date = new Date();
let sql = `SELECT * FROM users WHERE remember_token = 1`
  con.query(sql, function (err, result) {
    if (err) console.log(err);
    res.send(result)
    })
  })


// Register an user 
app.post('/users', (req, res, next) => {
var date = new Date();
const body = req.body;
  con.query(`
  UPDATE users SET remember_token = 0;
  INSERT INTO users (name, email, created_at, upload_at, password, is_admin, remember_token, preferences) VALUES 
  ('${body.name}', '${body.email}', '${date.toISOString().substring(0, 10)}', '${date.toISOString().substring(0, 10)}', '${body.password}', 0, 1, '[]')
  `, function (err, result) {
    if (err) return next(err);
    res.send(result[1])
  });
});

///////////////////////////////////////////////////////////////// Songs data

// increase play count of a song
app.put('/count', (req, res) => {
const body = req.body;
  con.query(`
UPDATE songs SET play_count = ${body.count} WHERE youtube_id = ${body.song_id};
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result)
    })
  })

// toggle song in user's preferneces
app.put('/like', (req, res) => {
const body = req.body;
console.log(body)
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', ${JSON.stringify({song_id: body.song_id, is_liked: body.is_liked})})
WHERE email = ${body.user};
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result)
    })
  })
  



///////////////////////////////////////////////////////////////// Get TOP

  // Get top_songs
app.get('/top_songs', (req, res) => {
  let sql = `SELECT * FROM songs ORDER BY play_count DESC`;
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
  let sql = `INSERT INTO playlists (name, cover_img, songs, created_at,  upload_at) VALUES 
  (${body.name}, ${body.cover_img}, ${body.songs}, ${body.created_at}, ${upload_at.length})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


///////////////////////////////////////////////////////////////// PUT

// PUT song
app.put('/song', (req, res) => {
const body = req.body;
let sql = `UPDATE songs SET title = ${body.title}, album = ${body.album}, artist = ${body.artist},
created_at = ${body.created_at}, length = ${body.length}, lyrics = ${body.lyrics}, track_number = ${body.track_number},
upload_at = ${body.upload_at}, youtube_link = ${body.youtube_link} WHERE id = ${body.id} `
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

// PUT artist
app.put('/artist', (req, res) => {
const body = req.body;
  let sql = `UPDATE artists SET name = ${body.name}, cover_img = ${body.cover_img}, upload_at = ${body.upload_at} WHERE id = ${body.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// PUT album 
app.put('/album', (req, res) => {
const body = req.body;
  let sql = `UPDATE albums SET name = ${body.name}, artist = ${body.artist}, cover_img = ${body.cover_img},
  created_at = ${body.created_at}, upload_at = ${body.upload_at} WHERE id = ${body.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// PUT playlist
app.put('/playlist', (req, res) => {
const body = req.body;
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


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});