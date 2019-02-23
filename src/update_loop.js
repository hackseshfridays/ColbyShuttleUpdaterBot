/*
  All the logic and associated, useful for functionality for the main event
  loop, a loop that keeps track of and calculates the eta for the shuttle(s) to
  each route stop.

  Disrupt Colby 2019
  Author(s): robertDurst
*/
const {getMapStopEstimates, getShuttleLocation} = require('maverick');
const {STOPS, ALFOND_COMMONS, DAVIS, DIAMOND, COTTER, OUT_OF_SERVICE} =
    require('./constants');

// state of the shuttle stops with:
//  eta: time to arrival of closest shuttle
//  ticks: seconds * 5 since last event/update (rests on arrival)
let busTimeEstimateState = {};

// get the loop structure
const getEstimateForStop = stop => busTimeEstimateState[stop].eta.time;

// returns the data structure for keeping track of the ETA to each stop
const initLoopDataStructure = () => {
  const loopStructure = {};

  STOPS.forEach(stop => {
    loopStructure[stop] = {eta: {time: OUT_OF_SERVICE, bus: 0}, ticks: 0};
  });

  return loopStructure;
};

// adjust the ticks for a given loop iteration
const updateTicks =
    () => {
      // capture arriving buses
      const stopNotifications = {arriving: [], toUpdate: []};

      STOPS.forEach(stop => {
        const curStop = busTimeEstimateState[stop];

        // within a minute of arriving and slowing down
        if (curStop.eta.time < 60 && curStop.ticks != -1) {
          // add to arrving array and reset ticks
          stopNotifications.arriving.push(stop);
          curStop.ticks = -1;
        } else if (curStop.ticks == 12) {
          stopNotifications.toUpdate.push(stop);
          curStop.ticks = 0;
          // just departed
        } else {
          curStop.ticks++;
        }
      });

      return stopNotifications;
    }


// starts a loop that will run forever
const initUpdateLoop = (interval, callback) => {
  // initialize the bus estimates state
  busTimeEstimateState = initLoopDataStructure();

  setInterval(async () => {
    // copy the global state
    const loopStructure = busTimeEstimateState;

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
            curFastest = loopStructure[STOPS[ALFOND_COMMONS]].eta.time;
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;
            if (loopStructure[STOPS[ALFOND_COMMONS]].ticks == -1 ||
                curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[ALFOND_COMMONS]].eta.time =
                  estimatedTimeForBus;
              loopStructure[STOPS[ALFOND_COMMONS]].eta.bus =
                  stop.Estimates[0].VehicleID;
            }
            break;
          // intentially bleed through here since the following are
          // equivalent
          case 'Davis':
          case 'Bixler and Davis':
            curFastest = loopStructure[STOPS[DAVIS]].eta.time;
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (loopStructure[STOPS[DAVIS]].ticks == -1 ||
                curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[DAVIS]].eta.time = estimatedTimeForBus;
              loopStructure[STOPS[DAVIS]].eta.bus = stop.Estimates[0].VehicleID;
            }
            break;
          case 'Diamond':
            curFastest = loopStructure[STOPS[DIAMOND]].eta.time;
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (loopStructure[STOPS[DIAMOND]].ticks == -1 ||
                curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[DIAMOND]].eta.time = estimatedTimeForBus;
              loopStructure[STOPS[DIAMOND]].eta.bus =
                  stop.Estimates[0].VehicleID;
            }
            break;
          case 'Eustis and Cotter':
            curFastest = loopStructure[STOPS[COTTER]].eta.time;
            estimatedTimeForBus = stop.Estimates[0].SecondsToStop;

            if (loopStructure[STOPS[COTTER]].ticks == -1 ||
                curFastest > estimatedTimeForBus) {
              loopStructure[STOPS[COTTER]].eta.time = estimatedTimeForBus;
              loopStructure[STOPS[COTTER]].eta.bus =
                  stop.Estimates[0].VehicleID;
            }
            break;
        }
      });
    });
    busTimeEstimateState = loopStructure;

    callback(updateTicks());
  }, interval);
};

module.exports = {
  initUpdateLoop,
  getEstimateForStop,
}