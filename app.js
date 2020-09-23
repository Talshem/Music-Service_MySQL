const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.static(__dirname + '/client/build'));

// connection
require("./models/index")

app.use('/', (req,res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});