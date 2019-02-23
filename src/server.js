const bodyParser = require('body-parser');
const express = require('express')
const {parseMessage} = require('./messageParser');
const {initUpdateLoop, getEstimateForStop} = require('./update_loop');
const messages = require('./messages');
const {STOPS, ALFOND_COMMONS, DAVIS, DIAMOND, COTTER, OUT_OF_SERVICE} =
    require('./constants');
const {sendText} = require('./twilio');
const {buildQueue, addToQueue, removeFromQueue, clearQueue} =
    require('./queue');
const {createPerson} = require('./person');

// constants
const SECONDS = 1000;

// vars for server
const app = express()
const port = 3000 || process.env.PORT;
let queue = buildQueue();

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

// receive and respond to twilio messages
app.post('/message', async (req, res) => {
  const number = req.body.From;
  const message = parseMessage(req.body.Body);

  let messageToSend;
  let locationText;
  switch (message.type) {
    // received ready message
    case 1:
      switch (message.currentLocation) {
        // downtown
        case 1: {
          locationText = STOPS[ALFOND_COMMONS];
          const eta = getEstimateForStop(locationText);
          messageToSend = messages.onboardMessage('Alfond Commons', eta);
          break;
        }
        // cotter
        case 2: {
          locationText = STOPS[COTTER];
          const eta = getEstimateForStop(locationText);
          messageToSend = messages.onboardMessage('Cotter', eta);
          break;
        }
        // diamond
        case 3: {
          locationText = STOPS[DIAMOND];
          const eta = getEstimateForStop(locationText);
          messageToSend = messages.onboardMessage('Diamond', eta);
          break;
        }
        // davis
        case 4: {
          locationText = STOPS[DAVIS];
          const eta = getEstimateForStop(locationText);
          messageToSend = messages.onboardMessage('Davis', eta);
          break;
        }
        // unknown
        case 5:
        // null
        case 6:
          messageToSend = messages.invalidMessage();
          break;
      }

      if (message.currentLocation != 5 && message.currentLocation != 6) {
        // create a new person object
        const person = createPerson(number, locationText)

        // add person to the queue
        queue = addToQueue(queue, person);
      }
      break;
    // cancel
    case 2:
      messageToSend = messages.cancelMessage();
      queue = removeFromQueue(queue, number);
      break;
    // help and help
    case 3:
    case 4:
      messageToSend = messages.helpMessage();
      break;
  }

  // send message via Twilio (shout out to Nile the Twilio God)
  sendText(number, messageToSend);


  console.log(queue);
  res.send('Ok');
});

// launch the app
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// start the loop and set to every five seconds
initUpdateLoop(5 * SECONDS, (notifications) => {
  notifications.arriving.forEach(stopText => {
    const toText = queue.filter(person => person.location == stopText);
    const messageToSend = messages.arrivalMessage(stopText);

    toText.forEach(person => {
      const number = person.phoneNumber;
      sendText(number, messageToSend);
      queue = removeFromQueue(queue, number);
    });
  });

  notifications.toUpdate.forEach(stopText => {
    const toText = queue.filter(person => person.location == stopText);
    const messageToSend =
        messages.updateMessage(stopText, getEstimateForStop(stopText));

    toText.forEach(person => {
      const number = person.phoneNumber;
      sendText(number, messageToSend);
    });
  });
});