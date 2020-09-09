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
  con.query("SELECT * FROM table", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});