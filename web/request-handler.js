var path = require('path');
var url = require('url');
var fs = require('fs');
var fetcher = require(__dirname + '/../workers/htmlfetcher');
module.exports.datadir = path.join(__dirname, "../data/sites.txt"); // tests will need to override this.



module.exports.handleRequest = function (req, res) {
  // console.log(req.method);
  var route = url.parse(req.url).pathname;
  if(req.method === "GET") {
    if(route === "/"){
      fs.readFile(__dirname + '/public/index.html', function(err, html) {
        if(err) console.log(err);
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(html);
      });
    } else if (route === "/secretroute"){
      console.log('Request for URLs recieved');
      fetcher.readUrls(function(urls){
        console.log('Responding to request for URLs');
        res.writeHead(200);
        res.end(JSON.stringify(urls));
      });
    } else {
      fetcher.readUrls(function(urls){
        var found = false;
        for(var i = 0; i < urls.length; i++) {
          if(urls[i] === route.substring(1)) {
            found = true;
            fetcher.get(urls[i], function(data) {
              res.writeHead(200, {"Content-Type":"text/html"});
              res.end(data[0].FILE);
            });
          }
        }
        if(found===false){
          res.writeHead(404);
          res.end();
        };
      });
    }
  } else if(req.method === "POST") {
    if(route === "/") {
      var postData = "";
      req.on('data', function(chunk) {
        postData += chunk;
        console.log('Chunk received:', chunk);
      });
      req.on('end', function(){
        console.log(JSON.parse(postData));
        fetcher.write(JSON.parse(postData));
        res.writeHead(302);
        res.end();
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  }
};
