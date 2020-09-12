require('dotenv').config();
var mysql = require('mysql');
const path = require('path')

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/client/build'));


const cors = require('cors');
app.use(cors());

var con = mysql.createConnection({
  host: process.env.DB_host,
  user: process.env.DB_user,
  password: process.env.DB_password,
  database: process.env.DB_database,
  multipleStatements: true,
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


///////////////////////////////////////////////////////////////// USER

    // get preferences
app.get('/preferences/:user', (req, res, next) => {
  con.query(`
SELECT preferences FROM users WHERE email = '${req.params.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })


    // auto login via local storage
app.get('/auto/:user', (req, res, next) => {
  con.query(`
SELECT * FROM users WHERE email = '${req.params.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })

    // login user
app.put('/users', (req, res, next) => {
const body = req.body
var date = new Date();
  con.query(`
UPDATE users SET remember_token = 1 WHERE email = '${body.email}';
UPDATE users SET upload_at = '${date.toISOString().substring(0, 10)}' WHERE email = '${body.email}';
SELECT * FROM users WHERE email = '${body.email}' AND password = '${body.password}';
    `, function (err, result) {
    if (result[2].length === 0) return next(err);
    res.send(result[2])
    })
  })

      // logout user
app.put('/logout', (req, res) => {
const body = req.body
con.query(`
UPDATE users SET remember_token = 0 WHERE email = '${body.email}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result)
    })
  })

// Register an user 
app.post('/users', (req, res, next) => {
var date = new Date();
const body = req.body;
  con.query(`
  INSERT INTO users (name, email, created_at, upload_at, password, is_admin, remember_token, preferences) VALUES 
  ('${body.name}', '${body.email}', '${date.toISOString().substring(0, 10)}', '${date.toISOString().substring(0, 10)}', '${body.password}', 0, 1, '[]')
  `, function (err, result) {
    if (err) return next(err);
    res.send(result)
  });
});


///////////////////////////////////////////////////////////////// Play Count

// increase play count of a song
app.put('/count', (req, res) => {
const body = req.body;
  con.query(`
UPDATE songs SET play_count = ${body.count} WHERE youtube_id = '${body.song_id}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result)
    })
  })

///////////////////////////////////////////////////////////////// Preferences 

// toggle song in user's preferneces
app.put('/song/like', (req, res) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'song: ${body.youtube_id}')
WHERE email = '${body.user}';
UPDATE songs SET is_liked = ${body.is_liked} WHERE youtube_id = '${body.youtube_id}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  } else if (body.toggle === 'unlike') {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`song: ${body.youtube_id}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE songs SET is_liked = ${body.is_liked} WHERE youtube_id = '${body.song_id}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  }
  })

 // toggle album in user's preferneces
app.put('/album/like', (req, res) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'album: ${body.name}')
WHERE email = '${body.user}';
UPDATE albums SET is_liked = ${body.is_liked} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  } else if (body.toggle === 'unlike') {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`album: ${body.name}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE albums SET is_liked = ${body.is_liked} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  }
  }) 

 // toggle artist in user's preferneces
app.put('/artist/like', (req, res) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'artist: ${body.name}')
WHERE email = '${body.user}';
UPDATE artists SET is_liked = ${body.is_liked} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  } else if (body.toggle === 'unlike') {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`artist: ${body.name}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE artists SET is_liked = ${body.is_liked} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  }
  }) 

 // toggle playlist in user's preferneces
app.put('/playlist/like', (req, res) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'playlist: ${body.id}')
WHERE email = '${body.user}';
UPDATE playlists SET is_liked = ${body.is_liked} WHERE id = ${body.id};
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  } else if (body.toggle === 'unlike') {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`playlist: ${body.id}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE playlists SET is_liked = ${body.is_liked} WHERE id = ${body.id};
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  }
  }) 

///////////////////////////////////////////////////////////////// Get TOP

  // Get top_songs
app.get('/top_songs', (req, res) => {
  let sql = "SELECT * FROM songs ORDER BY play_count DESC";
  con.query(sql,function (err, result) {
    if (err) throw err;
    res.send(result)
    })
      res.cookie({
    sameSite: 'none'
  })
  })

  
  // Get top_albums 
app.get('/top_albums', (req, res) => {
  let sql = "SELECT * FROM albums ORDER BY is_liked DESC ";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

  // Get top_artists
app.get('/top_artists', (req, res) => {
  let sql = "SELECT * FROM artists ORDER BY is_liked DESC";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })


  // Get top_playlists 
app.get('/top_playlists', (req, res) => {
  let sql = "SELECT * FROM playlists ORDER BY is_liked DESC";
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
app.post('/song', (req, res, next) => {
const body = req.body;
console.log(body)
var date = new Date();
  let sql = `INSERT INTO songs (title, album, artist, created_at, length, lyrics, track_number, upload_at, youtube_id) VALUES 
  ('${body.title}', '${body.album}', '${body.artist}', '${body.created_at}', '${body.length}', '${body.lyrics.toString}', ${body.track_number}, '${date.toISOString().substring(0, 10)}', '${body.youtube_id}')`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
  });
});

/*
// POST artist
app.post('/artist', (req, res) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO artists (name, cover_img, upload_at) VALUES 
  (${body.name}, ${body.cover_img}, ${date.toISOString().substring(0, 10)})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// POST album 
app.post('/album', (req, res) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO albums (name, artist, cover_img, created_at, upload_at) VALUES 
  (${body.name}, ${body.artist}, ${body.cover_img}, ${body.created_at},${date.toISOString().substring(0, 10)})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});


// POST playlist
app.post('/playlist', (req, res) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO playlists (name, cover_img, songs, created_at,  upload_at) VALUES 
  (${body.name}, ${body.cover_img}, ${body.songs}, ${body.created_at}, ${date.toISOString().substring(0, 10)})`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
  });
});

*/

///////////////////////////////////////////////////////////////// DELETE

// DELETE song
app.delete('/song/:youtube_id', (req, res) => {
var sql = `DELETE FROM songs WHERE youtube_id = '${req.params.youtube_id}'`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

// DELETE album
app.delete('/album/:name', (req, res) => {
var sql = `DELETE FROM albums WHERE name = '${req.params.name}'`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});


// DELETE artist
app.delete('/artist/:name', (req, res) => {
var sql = `DELETE FROM artists WHERE name = '${req.params.name}'`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});


// DELETE playlist
app.delete('/playlist/:name', (req, res) => {
const body = req.body
var sql = `DELETE FROM playlists WHERE name = '${req.params.name}', id = '${body.id}'`;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

///////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////// PUT


/*
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

*/



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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});