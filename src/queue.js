let buildQueue = function () {
  q = new Array();

  return q
}



let addToQueue = function (q, person) {
  q.push(person);

  return q;
};

// PHONE # is unique identifier

let removeFromQueue = function (q, phoneNumber) {
  if (q.find(o => o.phoneNumber === phoneNumber) === False) {
    return -1;
  }
  let toRemove = q.indexOf(q.find(o => o.number === number))

  q = q.splice(toRemove, 1)

  return q
}

let clearQueue = function (q) {
  return buildQueue();
}

module.exports = {
  buildQueue,
  addToQueue,
  removeFromQueue,
  clearQueue
}
