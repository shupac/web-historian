// eventually, you'll have some code here that uses the tested helpers 
// to actually download the urls you want to download.

// Write a script in workers/htmlfetcher.js that uses the code in workers/lib/html-fetcher-helpers.js to download files when it runs (and then exit).

var fetcherHelpers = require('./lib/html-fetcher-helpers');


exports.fetch = function(){

  //read urls
  fetcherHelpers.readUrls(__dirname + '/../data/'+ 'sites.txt', fetcherHelpers.downloadUrls);

  //download content at each url

  //write content to the sites directory

};

exports.fetch();