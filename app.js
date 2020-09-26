const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.static(__dirname + '/client/build'));

// connection
require("./models/index")


app.use('/api/', require('./api'));

const PORT = process.env.PORT || 3005;

/*
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
*/
module.exports = app