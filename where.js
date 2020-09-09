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
  con.query("SELECT * FROM table WHERE prop = 'value'", function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});