let helpMessage = function () {
  return `You've reached the Colby Shuttle Bot! \n Text 'ready at' followed by a valid location- e.g. Ready at Cotter. \n valid locations are: ${STOPS.join(' ')} `
}

let invalidMessage = function () {
  return `Unknown location, please enter one of the following locations: ${STOPS.join(' ')}`;
}

let arrivalMessage = function (location) {
  return `The Shuttle is now arriving at ${location}. Thank you for using Colby Shuttle Bot!`
}

let updateMessage = function (location, secTilArrival) {
  let timeCleanedUp = Math.floor(secTilArrival / 60);
  let minute = "minute"
  if (timeCleanedUp > 1) {
    minute = "minutes";
  }
  return `Shuttle is ${timeCleanedUp} ${minute} away.`
}

let onboardMessage() = function (location, secTilArrival) {
  let currentTime = updateMessage(location, secTilArrival)
  return `Got it! You're by ${location}.${currentTime}`
}
