require('dotenv').config();
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));

const router = express.Router();
app.use(router);

const cors = require('cors');
app.use(cors());

app.use(express.static(__dirname + '/client/build'));

// connection
require("./models/index")

const PORT = process.env.PORT || 3001;

router.use((err, req, res, next) => {
  if (err) {
    return res.send(error.message);
  }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});