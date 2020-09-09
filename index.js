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
  console.log("Connected!");
 var sql = "ALTER TABLE users ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table altered");
  });
});