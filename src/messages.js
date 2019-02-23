/*
  Factory-ish methods for constructing the various messages sent by the bot.

  Disrupt Colby 2019
  Author(s): jmanyc, robertDurst
*/
const {STOPS} = require('./constants');

// general help message describing the possible shuttle stops and supported
// commands
let helpMessage = function() {
  return `You've reached the Colby Shuttle Bot! Text 'Ready' followed by a valid location- e.g. Ready at Cotter. \nValid locations are: \n${
      STOPS.map(x => x.toLowerCase())
          .join(
              '\n')} \nIf already queued in wait for bus, and looking to cancel, respond 'CANCEL'.`
};

// responds to unrecognized locations
let invalidMessage = function() {
  return `Unknown location, please enter one of the following locations:\n${
      STOPS.map(x => x.toLowerCase()).join(' ')}`;
};

// alerts user of the arrival of the shuttle
let arrivalMessage = function(location) {
  return `The Shuttle is now arriving at ${
      location}. Thank you for using the Colby Shuttle Bot!`
};

// updates the user based on the current eta for the bus
let updateMessage = function(location, secTilArrival) {
  let timeCleanedUp = Math.floor(secTilArrival / 60);
  let minute = 'minute'
  if (timeCleanedUp > 1) {
    minute = 'minutes';
  }
  return `Shuttle is ${timeCleanedUp} ${
      minute} away. If you are no longer interested in receving these updates, respond 'CANCEL'.`
};

// confirms the user is enqueued and also lets them know of current eta
let onboardMessage = function(location, secTilArrival) {
  let currentTime = updateMessage(location, secTilArrival)
  return `Got it! You're outside ${location}. ${currentTime}`
};

// confirms user has cancelled notification updates.
let cancelMessage = function() {
  return `Ok! Cancelled. You will no longer receive any more text updates from us. Thanks for using the Colby Shuttle Bot.`;
};

module.exports = {
  helpMessage,
  invalidMessage,
  arrivalMessage,
  onboardMessage,
  cancelMessage,
  updateMessage,
}