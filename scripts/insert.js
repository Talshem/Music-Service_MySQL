require('dotenv').config();
var mysql = require('mysql');

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
  let sql = "INSERT INTO songs ( title, album, artist, created_at, length, lyrics, track_number, upload_at, youtube_link) VALUES ?";
  let values = [
[1,'A','snoop', new Date(1998, 12 ,22).toDateString(), '4:01', 'hello', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=1'],
[2,'B','dog', new Date(1977, 02 ,27).toDateString(), '3:56', 'whats up', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=2'],
[3,'C','bind', new Date(2000, 12 ,19).toDateString(), '3:28', 'amazon', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=3'],
[4,'D','prop', new Date(1999, 08 , 02).toDateString(), '4:17', 'europe', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=4'],
[5,'E','const', new Date(1975, 11 ,12).toDateString(), '3:23', 'chips', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=5'],
[6,'F','var', new Date(1986, 03 ,13).toDateString(), '3:14', 'wall', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=6'],
[7,'G','cheese', new Date(1977, 08 ,01).toDateString(), '2:59', 'blue', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=7'],
[8,'H','string', new Date(1978, 22 ,29).toDateString(), '3:14', 'hamburger', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=8'],
[9,'I','var', new Date(1998, 24 ,12).toDateString(), '3:02', 'space', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=9'],
[10,'J','snoop', new Date(2001, 09 ,26).toDateString(), '4:11', 'paper', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=10'],
[11, 'K','simple', new Date(2005, 12 ,28).toDateString(), '3:49', 'rocket', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=11'],
[11,'L','jam', new Date(1986, 02 ,15).toDateString(), '3:13', 'time', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=12'],
[12,'M','bind', new Date(2015, 01 ,05).toDateString(), '3:16', 'computer', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=13'],
[13,'N','bind', new Date(2016, 04 ,01).toDateString(), '4:02', 'java', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=14'],
[14,'O','dog', new Date(1997, 07 ,04).toDateString(), '4:31', 'let', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=15'],
[15,'P','date', new Date(2001, 12 ,19).toDateString(), '5:01', 'charge', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=16'],
[16,'Q','money', new Date(1999, 10 ,21).toDateString(), '3:48', 'press', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=17'],
[17,'R','success', new Date(1988, 9 ,19).toDateString(), '2:37', 'new', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=18'],
[18,'S','const', new Date(2007, 9 ,18).toDateString(), '3:58', 'color', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=19'],
[19,'T','when', new Date(2003, 7 ,13).toDateString(), '3:52', 'noise', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=20'],
[20,'U','letter', new Date(1997, 10 ,15).toDateString(), '4:04', 'pipe', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=21'],
[21,'V','toxic', new Date(1999, 11 ,05).toDateString(), '3:24', 'king', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=22'],
[22,'W','word', new Date(1992, 03 ,02).toDateString(), '3:36', 'queen', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=23'],
[23,'X','team', new Date(2004, 04 ,18).toDateString(), '4:00', 'prince', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=24'],
[24,'Y','snoop', new Date(1993, 04 ,25).toDateString(), '3:11', 'type', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=25'],
[25,'Z','hello', new Date(1997, 01 ,17).toDateString(), '3:56', 'name', 12,  new Date(1997, 12 ,12).toDateString(), 'https://www.youtube.com/watch?v=26'], 
];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});