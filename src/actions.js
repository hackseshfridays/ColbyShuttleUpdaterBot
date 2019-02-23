/*
  This code contains the actions for the two different types of events for the
  bot:
    1. receving a message from a user
    2. handling notifications as per an event in the event loop

  This is where the core logic comes together by way of using all the various
  modules from this project.

  Disrupt Colby 2019
  Author(s): robertDurst
*/
const {getEstimateForStop} = require('./update_loop');
const messages = require('./messages');
const {STOPS, ALFOND_COMMONS, DAVIS, DIAMOND, COTTER} = require('./constants');
const {sendText} = require('./twilio');
const {buildQueue, addToQueue, removeFromQueue} = require('./queue');
const {createPerson} = require('./person');

// module scoped state variables
let queue = buildQueue();

const handleReceivedMessage = (number, rawMessage) => {
  // parse message to received detailed message object
  const message = parseMessage(rawMessage);

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
};

const handleEventLoopUpdate = notifications => {
  (notifications) => {
    /**
     * for each arriving shuttle notification:
     *      1. get all numbers for people in queue at the stop
     *      2. determine message to text these people
     *      3. text all the numbers
     *      4. remove everyone from the queue
     */
    notifications.arriving.forEach(stopText => {
      const numbersToText = queue.filter(person => person.location == stopText)
                                .map(person => person.phoneNumber);
      const messageToSend = messages.arrivalMessage(stopText);

      numbersToText.forEach(number => {
        sendText(number, messageToSend);
        queue = removeFromQueue(queue, number);
      });
    });

    // same as above, but don't remove anyone from the queue
    notifications.toUpdate.forEach(stopText => {
      const numbersToText = queue.filter(person => person.location == stopText)
                                .map(person => person.phoneNumber);
      const messageToSend =
          messages.updateMessage(stopText, getEstimateForStop(stopText));

      numbersToText.forEach(number => {
        const number = person.phoneNumber;
        sendText(number, messageToSend);
      });
    });
  }
};

module.exports = {
  handleReceivedMessage,
  handleEventLoopUpdate,
}