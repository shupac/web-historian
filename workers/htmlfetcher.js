// eventually, you'll have some code here that uses the tested helpers
// to actually download the urls you want to download.

// Write a script in workers/htmlfetcher.js that uses the code in workers/lib/html-fetcher-helpers.js to download files when it runs (and then exit).

var fetcherHelpers = require('./lib/html-fetcher-helpers');

exports.write = function(urlString){
  fetcherHelpers.writeUrl(urlString);
};

exports.get = function(url, cb) {
  fetcherHelpers.get(url,cb);
};

exports.readUrls = function(cb) {
  fetcherHelpers.readUrls(cb);
};