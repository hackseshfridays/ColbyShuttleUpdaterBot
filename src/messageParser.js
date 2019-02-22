// aparently this is how you define enums in js
// https://stackoverflow.com/questions/287903/what-is-the-preferred-syntax-for-defining-enums-in-javascript
const messageType = Object.freeze({
  'READY': 1,
  'CANCEL': 2,
  'HELP': 3,
  'UNKNOWN': 4,
});

const location = Object.freeze({
  'DOWNTOWN': 1,
  'COTTER': 2,
  'DIAMOND': 3,
  'DAVIS': 4,
  'UNKNOWN': 5,
  'NULL': 6,
});

const parseMessage = (message) => {
  const words = message.trim().split(' ');
  const messageObj = {};
  messageObj.type = messageType.UNKNOWN;

  switch (words[0].toUpperCase()) {
    case 'READY':
      messageObj.type = messageType.READY;
      let currentLocation = location.UNKNOWN;
      if (words.length != 2) {
        currentLocation = location.NULL;
      } else {
        switch (words[1].toUpperCase()) {
          case 'DOWNTOWN':
            currentLocation = location.DOWNTOWN;
            break;
          case 'COTTER':
            currentLocation = location.COTTER;
            break;
          case 'DIAMOND':
            currentLocation = location.DIAMOND;
            break;
          case 'DAVIS':
            currentLocation = localStorage.DAVIS;
            break;
        }
      }
      messageObj.currentLocation = currentLocation;
      break;
    case 'CANCEL':
      messageObj.type = messageType.CANCEL;
      break;
    case 'HELP':
      messageObj.type = messageType.HELP;
      break;
  }

  return messageObj;
};

module.exports = {
  messageType,
  location,
  parseMessage,
}