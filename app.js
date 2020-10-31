const express = require('express');
const app = express();
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(express.static(__dirname + '/client/build'));

app.use(cors());
app.use(errorHandler)
app.use('/api/', require('./api'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// connection
require("./models/index")
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});

module.exports = app