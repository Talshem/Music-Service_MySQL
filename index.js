require('dotenv').config();
var mysql = require('mysql');
const express = require('express')
const app = express();

app.use(express.json());

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
});


  // Get top_songs LIMIT 20
app.get('/top_songs', (req, res) => {
  let sql = "SELECT * FROM songs ORDER BY title LIMIT 20";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })

    // Get a song LIMIT 20
app.get('/song/:title', (req, res) => {
  let sql = `SELECT * FROM songs WHERE title = ${req.params.title}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send(result)
    })
  })


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

// delete song
app.delete('/song/:title', (req, res) => {
var sql = `DELETE FROM songs WHERE title = ${req.params.title}, id = ${body.id} LIMIT 1 `;
con.query(sql, function (err, result) {
if (err) throw err;
res.send(result)
});
});

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});