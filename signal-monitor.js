// requires
var sr = require('./signal-request.js').SignalRetriever,
    five = require('johnny-five');

// constants
var INTERVAL = 500,
    URL = 'http://mifi.afrihost.com/api/monitoring/status';

// app variables
var timeoutId, previousReading, board, leds;

// initialize the arduino board
board = new five.Board({
  port: "COM12"
});

// mapping function
function map(x, minIn, maxIn, minOut, maxOut) {
  return (x - minIn) * (maxOut - minOut) / (maxIn - minIn) + minOut; 
}

board.on('ready', function() {
  // setup the led array (all pwm pins)
  leds = new five.Led.Array([3, 5, 6, 9, 10]);

  // main application loop
  timeoutId = setTimeout(function retrieve() {
    // use our signal retriever module to get the current signal strength
    sr.retrieve(URL, function(err, signal) {
      if (err || !signal.SignalStrength) {
        clearTimeout(timeoutId);
        console.log(err || 'signal strength not available');
        return;
      }

      var strength = parseInt(signal.SignalStrength[0], 10), ledStrength;

      if (!previousReading || previousReading !== strength) {
        previousReading = strength; 
        
        // switch correct leds on/off
        ledStrength = map(previousReading, 0, 100, 1, leds.length);

        // log new strength
        console.log('1. reading:' + previousReading + ', mapped:' + ledStrength);

        // switch on/off any leds
        leds.each(function(led, i) {
          led[(i + 1) < ledStrength ? 'on' : 'off'].call(this);
        });

        // now show fractional strength
        var rounded = Math.floor(ledStrength), 
            fraction = ledStrength - rounded,
            mapped = Math.floor(map(fraction, 0, 1, 1, 255));
         
        // log and set   
        console.log('2. rounded: ' + rounded + ', fraction: ' + fraction + ', mapped:' + mapped);
        leds[rounded].brightness(mapped);
      }

      // poll again
      setTimeout(retrieve, INTERVAL);
    });
  }, INTERVAL);
});