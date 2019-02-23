/*
  Description of the person (user) class and a factory method for returning
  person objects.

  Disrupt Colby 2019
  Author(s): jmanyc, robertDurst
*/

// create and return a new person object
const createPerson = (phoneNumber, location) => ({phoneNumber, location});

module.exports = {createPerson}
