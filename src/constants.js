/*
  Set of predefined constants for cleaner code

  Disrupt Colby 2019
  Author(s): robertDurst
*/

// TODO: make this not hard coded
const STOPS = ['DOWNTOWN', 'DAVIS', 'DIAMOND', 'COTTER'];
const ALFOND_COMMONS = 0;
const DAVIS = 1;
const DIAMOND = 2;
const COTTER = 3;

// number value for a shuttle that is not running
const OUT_OF_SERVICE = Number.MAX_SAFE_INTEGER;

const SECONDS = 1000;

module.exports = {
  STOPS,
  ALFOND_COMMONS,
  DAVIS,
  DIAMOND,
  COTTER,
  OUT_OF_SERVICE,
  SECONDS,
}