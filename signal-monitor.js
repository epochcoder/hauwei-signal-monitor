// requires
var sr = require('./signal-request.js').SignalRetriever;

// constants
var INTERVAL = 500,
    URL = 'http://mifi.afrihost.com/api/monitoring/status';

// app variables
var timeoutId, previousReading;

// main application loop
timeoutId = setTimeout(function retrieve() {
  // use our signal retriever module to get the current signal strength
  sr.retrieve(URL, function(err, signal) {
    if (err || !signal.SignalStrength) {
      clearTimeout(timeoutId);
      console.log(err || 'signal strength not available');
      return;
    }

    var strength = parseInt(signal.SignalStrength[0], 10);
    if (!previousReading || previousReading !== strength) {
      previousReading = strength; 

      // strength changed, let other modules know
      console.log(previousReading);
    }

    // poll again
    setTimeout(retrieve, INTERVAL);
  });
}, INTERVAL);