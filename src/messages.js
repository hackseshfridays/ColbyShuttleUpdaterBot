const {STOPS} = require('./constants');

let helpMessage = function() {
  return `You've reached the Colby Shuttle Bot! Text 'ready at' followed by a valid location- e.g. Ready at Cotter. \nValid locations are: \n${
      STOPS.map(x => x.toLowerCase()).join('\n')} `
};

let invalidMessage = function() {
  return `Unknown location, please enter one of the following locations:\n${
      STOPS.map(x => x.toLowerCase()).join(' ')}`;
};

let arrivalMessage = function(location) {
  return `The Shuttle is now arriving at ${
      location}. Thank you for using Colby Shuttle Bot!`
};

let updateMessage = function(location, secTilArrival) {
  let timeCleanedUp = Math.floor(secTilArrival / 60);
  let minute = 'minute'
  if (timeCleanedUp > 1) {
    minute = 'minutes';
  }
  return `Shuttle is ${timeCleanedUp} ${minute} away.`
};

let onboardMessage = function(location, secTilArrival) {
  let currentTime = updateMessage(location, secTilArrival)
  return `Got it! You're outside ${location}. ${currentTime}`
};

let cancelMessage = function() {
  return `Ok! Cancelled. Thanks for using Colby Shuttle Bot.`;
};

module.exports = {
  helpMessage,
  invalidMessage,
  arrivalMessage,
  onboardMessage,
  cancelMessage,
  updateMessage,
}