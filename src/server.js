const bodyParser = require('body-parser');
const express = require('express')
const {receive_message} = require('./twilio');

const app = express()
const port = 3000 || process.env.PORT;

// enable cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// receive and respond to twilio messages
app.post('/message', async (req, res) => {
  receive_message(req.body);
  res.send('Ok');
});