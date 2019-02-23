/*
  The main code for the bot that gets called and executed. Within this file is
  the server for receiving messages from the Twilio API and also the execution
  of the event loop.

  Disrupt Colby 2019
  Author(s): robertDurst
*/

const bodyParser = require('body-parser');
const express = require('express')
const {SECONDS} = require('./constants');
const {initUpdateLoop} = require('./update_loop');
const {handleReceivedMessage, handleEventLoopUpdate} = require('./actions');

// vars for server
const app = express()
const port = process.env.PORT || 3000;

// set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// receive and respond to twilio messages
app.post('/message', async (req, res) => {
  // parse information from request
  const phoneNumber = req.body.From;
  const message = req.body.Body;

  // delegate execution to handler
  handleReceivedMessage(phoneNumber, message);

  res.send('Ok');
});

// launch the app
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// start the loop, set to every five seconds, and supply event loop action
// handler function
initUpdateLoop(5 * SECONDS, handleEventLoopUpdate);