let buildQueue =
    function() {
  let q = new Array();

  return q
}


let addToQueue = function(q, p) {
  if (q.filter(person => person.phoneNumber == p.phoneNumber).length !== 0) {
    let index = q.indexOf(q.find(o => o.phoneNumber === p.phoneNumber));
    q[index].location = p.location;
  } else {
    q.push(p);
  }
  return q;
};

// PHONE # is unique identifier

let removeFromQueue =
    function(q, phoneNumber) {
  // not there
  if (q.filter(person => person.phoneNumber == phoneNumber).length === 0) {
    return q;
  }

  let toRemove = q.indexOf(q.find(o => o.phoneNumber === phoneNumber))
  q = q.slice(0, toRemove).concat(q.slice(toRemove + 1, q.length))

  return q
}

let clearQueue = function(q) {
  return buildQueue();
};

module.exports = {
  buildQueue,
  addToQueue,
  removeFromQueue,
  clearQueue
};
