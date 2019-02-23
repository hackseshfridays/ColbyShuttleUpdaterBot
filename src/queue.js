/*
  Description of the queue class and basic related methods for accessing,
  creating, and updating queues. We use phone numbers as the unique identifier.

  Disrupt Colby 2019
  Author(s): jmanyc, robertDurst
*/

// construct and return a new queue
const buildQueue = () => [];

// helper function for determing if a person is in the queue via their phone
// number
const queueContainsPerson = (q, phoneNumber) =>
    q.filter(person => person.phoneNumber == phoneNumber).length !== 0;

// helper function for determining the index of a person in the queue
const getPersonIndexInQueue = (q, phoneNumber) =>
    q.indexOf(q.find(person => person.phoneNumber === phoneNumber));

// either add a person to the queue or update (override) their current location
let addToQueue = (q, p) => {
  queueContainsPerson(q, p.phoneNumber) ? q[index].location = p.location :
                                          q.push(p);
  return q;
};

// removes a person from the queue if they exist
let removeFromQueue = (q, phoneNumber) => {
  // person exists in queue
  if (queueContainsPerson(q, phoneNumber)) {
    const index = getPersonIndexInQueue(q, phoneNumber)
    return q.slice(0, index).concat(q.slice(index + 1, q.length))
  }

  return q;
};

module.exports = {
  buildQueue,
  addToQueue,
  removeFromQueue,
};
