// requires
var request = require('request'),
    xml2js = require('xml2js');

// define our main class
var SignalRetriever = function() {
  var that = this;

  function retrieve(url, callback) {
    request(url, function(error, response, body) {
      var xml;
      if (!error && response.statusCode == 200) {
        // parse the xml returned from the url
        xml2js.parseString(body, function(err, result) {
          if (err) {
            callback.call(this, 'could not parse xml[' + result + ']');  
          } else {
            if (result && result.response) {
              // check if a response object exists and return to caller
              callback.call(this, null, result.response);
            } else {
              callback.call(this, 'did not get expected output from url[' + url + ']!');  
            }
          }
        });
      } else {
          callback.call(this, 'could not read url[' + url + ']');
      }
    }.bind(that));
  }

  return {
    retrieve: retrieve
  };
};

// export a new instance of our module
exports.SignalRetriever = new SignalRetriever();