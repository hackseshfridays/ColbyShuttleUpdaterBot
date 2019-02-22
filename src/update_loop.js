const {getMapStopEstimates} = require('maverick');
const {STOPS, ALFOND_COMMONS, DAVIS, DIAMOND, COTTER, OUT_OF_SERVICE} =
    require('./constants');

let busTimeEstimateState = initLoopDataStructure();

// get the loop structure
const getEstimatesState = () => busTimeEstimateState;

// returns the data structure for keeping track of the ETA to each stop
const initLoopDataStructure = () => {
  const loopStructure = {};

  STOPS.forEach(stop => {
    loopStructure[stop] = OUT_OF_SERVICE;
  });

  return loopStructure;
};

// starts a loop that will run forever
const initUpdateLoop = interval => {
  setInterval(async () => {
    // create new data structure since we are only using pure functions
    const loopStructure = initLoopDataStructure();
    // get latest estimates
    const estimates = await getMapStopEstimates();

    // for each bus and for each stop, update each hardcoded location with the
    // closest buses ETA
    estimates.forEach(bus => {
      bus.RouteStops.forEach(stop => {
        let curFastest;
        let estimatedTimeForBus;

        switch (stop.Description) {
          case 'Alfond Commons':
            curFastest = loopStructure[STOPS[ALFOND_COMMONS]];
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[ALFOND_COMMONS]] = estimatedTimeForBus;
            }
            break;
          // intentially bleed through here since the following are
          // equivalent
          case 'Davis':
          case 'Bixler and Davis':
            curFastest = loopStructure[STOPS[DAVIS]];
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[DAVIS]] = estimatedTimeForBus;
            }
            break;
          case 'Diamond':
            curFastest = loopStructure[STOPS[DIAMOND]];
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[DIAMOND]] = estimatedTimeForBus;
            }
            break;
          case 'Eustis and Cotter':
            curFastest = loopStructure[STOPS[COTTER]];
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[COTTER]] = estimatedTimeForBus;
            }
            break;
        }
      });
    });
  }, interval);

  busTimeEstimateState = loopStructure;
};

module.exports = {
  initUpdateLoop,
  getEstimatesState,
}