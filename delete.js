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
  var sql = "DELETE FROM table WHERE prop = 'value'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Number of - deleted: " + result.affectedRows);
  });
});