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
var date = new Date();
  con.query(`
UPDATE users SET last_login = '${date.toISOString().substring(0, 10)}' WHERE auto_code = '${req.params.user}' AND remember_token = 1;
SELECT * FROM users WHERE auto_code = '${req.params.user}' AND remember_token = 1;
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[1])
    })
  })

    // login user
app.put('/users', (req, res, next) => {
const body = req.body
var date = new Date();
  con.query(`
UPDATE users SET remember_token = 1, auto_code = '${body.auto_code}' WHERE email = '${body.email}';
UPDATE users SET last_login = '${date.toISOString().substring(0, 10)}' WHERE auto_code = '${body.email}';
SELECT * FROM users WHERE email = '${body.email}' AND password = '${body.password}';
    `, function (err, result) {
    if (result[2].length === 0) return next(err);
    res.send(result[2])
    })
  })

// get an user
app.get('/user/:name', (req, res, next) => {
var date = new Date();
  con.query(`
SELECT username, created_at, last_login FROM users WHERE username = '${req.params.name}';
    `, function (err, result) {
    if(err) return next(err);
    res.send(result)
    })
  }) 

      // logout user
app.put('/logout', (req, res, next) => {
const body = req.body
con.query(`
UPDATE users SET remember_token = 0, auto_code = 0 WHERE email = '${body.email}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })

// Register an user 
app.post('/users', (req, res, next) => {
var date = new Date();
const body = req.body;
  con.query(`
  INSERT INTO users (username, email, created_at, last_login, password, remember_token, preferences, auto_code) VALUES 
  ('${body.username}', '${body.email}', '${date.toISOString().substring(0, 10)}', '${date.toISOString().substring(0, 10)}', '${body.password}', 1, '[]', '${body.auto_code}');
  SELECT * FROM users WHERE email = '${body.email}' AND password = '${body.password}';
  `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
  });
});


///////////////////////////////////////////////////////////////// Play Count

// increase play count of a song
app.put('/count', (req, res, next) => {
const body = req.body;
  con.query(`
UPDATE songs SET play_count = ${body.count} WHERE youtube_id = '${body.song_id}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })

///////////////////////////////////////////////////////////////// Preferences 

// toggle song in user's preferneces
app.put('/song/like', (req, res, next) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =JSON_ARRAY_APPEND (preferences, '$', 'song: ${body.youtube_id}')WHERE email = '${body.user}';
UPDATE songs SET is_liked = ${body.is_liked + 1} WHERE youtube_id = '${body.youtube_id}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  } else {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`song: ${body.youtube_id}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'WHERE email = '${body.user}';
UPDATE songs SET is_liked =${body.is_liked - 1} WHERE youtube_id = '${body.youtube_id}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  }
  })

 // toggle album in user's preferneces
app.put('/album/like', (req, res, next) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'album: ${body.name}')
WHERE email = '${body.user}';
UPDATE albums SET is_liked = ${body.is_liked + 1} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) console.log(err);
    res.send(result[2])
    })
  } else {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`album: ${body.name}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE albums SET is_liked = ${body.is_liked - 1} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  }
  }) 

 // toggle artist in user's preferneces
app.put('/artist/like', (req, res, next) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'artist: ${body.name}')
WHERE email = '${body.user}';
UPDATE artists SET is_liked = ${body.is_liked + 1} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  } else {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`artist: ${body.name}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE artists SET is_liked = ${body.is_liked - 1} WHERE name = '${body.name}';
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  }
  }) 

 // toggle playlist in user's preferneces
app.put('/playlist/like', (req, res, next) => {
  const body = req.body;
  if (body.toggle === 'like') {
  con.query(`
UPDATE users SET preferences =
JSON_ARRAY_APPEND (preferences, '$', 'playlist: ${body.id}')
WHERE email = '${body.user}';
UPDATE playlists SET is_liked = ${body.is_liked + 1} WHERE id = ${body.id};
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  } else if (body.toggle === 'unlike') {
let preferences = body.preferences;
let x = preferences.filter(e => JSON.stringify(e) !== JSON.stringify(`playlist: ${body.id}`))
con.query(`
UPDATE users SET preferences = '${JSON.stringify(x)}'
WHERE email = '${body.user}';
UPDATE playlists SET is_liked = ${body.is_liked - 1} WHERE id = ${body.id};
SELECT preferences FROM users WHERE email = '${body.user}';
    `, function (err, result) {
    if (err) return next(err);
    res.send(result[2])
    })
  }
  }) 

///////////////////////////////////////////////////////////////// Get 1

  // Get song
app.get('/song/:id', (req, res,next) => {
  let sql = `
  SELECT * FROM songs WHERE youtube_id= '${req.params.id}';
  `;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })


  
  // Get albums
app.get('/album/:id', (req, res, next) => {
  let sql = `
  SELECT * FROM albums WHERE id= '${req.params.id}';
  `;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })

  // Get artist
app.get('/artist/:id', (req, res, next) => {
  let sql = `
  SELECT * FROM artists WHERE id = '${req.params.id}';
  `;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })



  // Get playlist
app.get('/playlist/:id', (req, res, next) => {
  let sql = `
  SELECT * FROM playlists WHERE id= '${req.params.id}';
  `;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })



///////////////////////////////////////////////////////////////// Get TOP

  // Get top_songs
app.get('/top_songs', (req, res,next) => {
  const { name } = req.query;
  const { album } = req.query;
  const { artist } = req.query;
  let sql = `
  SELECT * FROM songs WHERE title LIKE '%${name ? name : ''}%' ORDER BY play_count DESC LIMIT 20;
  SELECT * FROM songs WHERE album = '${album}' ORDER BY play_count DESC;
  SELECT * FROM songs WHERE artist = '${artist}' ORDER BY play_count DESC;
  `
  con.query(sql,function (err, result) {
    if (err) return next(err);
    res.send(result)
  })
  })

  
  // Get top_albums 
app.get('/top_albums', (req, res, next) => {
  const { artist } = req.query;
  const { name } = req.query;
  let sql = `
  SELECT * FROM albums WHERE name LIKE "%${name ? name : ''}%" ORDER BY is_liked DESC LIMIT 20;
  SELECT * FROM albums WHERE artist = '${artist}' ORDER BY is_liked DESC;
  `;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })

  // Get top_artists
app.get('/top_artists', (req, res, next) => {
    const { name } = req.query;
  let sql = `SELECT * FROM artists WHERE name LIKE "%${name ? name : ''}%" ORDER BY is_liked DESC LIMIT 20;`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })


  // Get top_playlists 
app.get('/top_playlists', (req, res, next) => {
    const { name } = req.query;
  let sql = `SELECT * FROM playlists WHERE name LIKE "%${name ? name : ''}%" ORDER BY is_liked DESC LIMIT 20`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
    })
  })


///////////////////////////////////////////////////////////////// POST


// POST song 
app.post('/song', (req, res, next) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO songs (title, album, artist, created_at, length, lyrics, track_number, upload_at, youtube_id, user, user_name) VALUES 
  ('${body.title}', '${body.album}', '${body.artist}', '${body.created_at}', '${body.length}', '${body.lyrics}',
  ${body.track_number}, '${date.toISOString().substring(0, 10)}', '${body.youtube_id}', '${body.user}', '${body.user_name}')`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
  });
});


// POST artist
app.post('/artist', (req, res, next) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO artists (name, cover_img, upload_at, user, user_name) VALUES 
  ('${body.name}', '${body.cover_img}', '${date.toISOString().substring(0, 10)}', '${body.user}', '${body.user_name}')`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
  });
});


// POST album 
app.post('/album', (req, res, next) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO albums (name, artist, cover_img, created_at, upload_at, user, user_name) VALUES 
  ('${body.name}', '${body.artist}', '${body.cover_img}', '${body.created_at}',
  '${date.toISOString().substring(0, 10)}', '${body.user}', '${body.user_name}')`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
  });
});


// POST playlist
app.post('/playlist', (req, res, next) => {
const body = req.body;
var date = new Date();
  let sql = `INSERT INTO playlists (name, cover_img, songs, created_at, user, user_name) VALUES 
  ('${body.name}', '${body.cover_img}', '${JSON.stringify(body.songs)}',
  '${date.toISOString().substring(0, 10)}', '${body.user}', '${body.user_name}')`;
  con.query(sql, function (err, result) {
    if (err) return next(err);
    res.send(result)
  });
});


///////////////////////////////////////////////////////////////// DELETE

// DELETE song
app.delete('/song/:youtube_id', (req, res, next) => {
var sql = `DELETE FROM songs WHERE youtube_id = '${req.params.youtube_id}'`;
con.query(sql, function (err, result) {
if (err) return next(err);
res.send(result)
});
});

// DELETE album
app.delete('/album/:name', (req, res, next) => {
var sql = `DELETE FROM albums WHERE name = '${req.params.name}'`;
con.query(sql, function (err, result) {
if (err) return next(err);
res.send(result)
});
});


// DELETE artist
app.delete('/artist/:name', (req, res, next) => {
var sql = `DELETE FROM artists WHERE name = '${req.params.name}'`;
con.query(sql, function (err, result) {
if (err) return next(err);
res.send(result)
});
});


// DELETE playlist
app.delete('/playlist/:id', (req, res, next) => {
const body = req.body
var sql = `DELETE FROM playlists WHERE id = '${req.params.id}'`;
con.query(sql, function (err, result) {
if (err) return next(err);
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

app.get('/*', function(req, res) {   
  res.sendFile(path.join(__dirname + '/client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

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