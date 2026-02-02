const express = require('express')
const app = express()
var cors = require('cors')

// Adds headers: Access-Control-Allow-Origin: *
// CORS enabled for all orgins and requests for now
app.use(cors());
// Parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


module.exports = app;