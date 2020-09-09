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
  var sql = "SELECT * FROM table LIMIT 20";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});
